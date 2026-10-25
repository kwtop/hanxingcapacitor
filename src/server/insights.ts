import type { BackendEnv, RecordData } from './types';
import { filters, eventWhere } from './filters';
import { field, HttpError } from './http';
const joins = 'FROM events e LEFT JOIN inquiries i ON i.id=e.inquiry_id';
const aggregate = `COUNT(DISTINCT e.visitor_id) visitors,COUNT(DISTINCT e.visit_id) visits,
  SUM(e.type='page_view') page_views,SUM(e.type IN ('inquiry_click','whatsapp_click','email_click')) contact_clicks,
  COUNT(DISTINCT CASE WHEN e.type='form_start' THEN e.visitor_id END) form_starters,
  SUM(e.type='inquiry_success') inquiries,COUNT(DISTINCT CASE WHEN e.type='inquiry_success' THEN e.visitor_id END) converted_visitors`;
const numberRows = (row: RecordData | null) => Object.fromEntries(Object.entries(row || {}).map(([key,value]) => [key, Number(value || 0)]));
export async function overview(env: BackendEnv, url: URL) {
  const f = filters(url), current = eventWhere(f), previous = eventWhere(f, f.previousStart, f.start), both = eventWhere(f, f.previousStart, f.end);
  const aggQuery = (where: typeof current) => env.DB.prepare(`SELECT ${aggregate} ${joins} WHERE ${where.sql}`).bind(...where.values);
  const returning = (where: typeof current, start: number) => env.DB.prepare(`SELECT COUNT(*) returning_visitors FROM (SELECT e.visitor_id,MIN(v.first_seen) first_seen,COUNT(DISTINCT e.visit_id) sessions ${joins} JOIN visitors v ON v.id=e.visitor_id WHERE ${where.sql} GROUP BY e.visitor_id HAVING first_seen<? OR sessions>1)`).bind(...where.values, start);
  const dimension = (column: string, limit = 12) => env.DB.prepare(`SELECT e.${column} label,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='page_view') views,SUM(e.type='inquiry_success') inquiries ${joins} WHERE ${current.sql} GROUP BY e.${column} ORDER BY views DESC,visitors DESC LIMIT ${limit}`).bind(...current.values);
  const results = await env.DB.batch<RecordData>([
    aggQuery(current), aggQuery(previous), returning(current,f.start), returning(previous,f.previousStart),
    env.DB.prepare(`SELECT strftime('%Y-%m-%d',e.occurred_at/1000,'unixepoch','+8 hours') day,${aggregate} ${joins} WHERE ${both.sql} GROUP BY day ORDER BY day`).bind(...both.values),
    dimension('page',10),dimension('country'),dimension('source'),dimension('channel'),dimension('device'),
    env.DB.prepare(`SELECT p.value label,SUM(e.type='product_view') views,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='inquiry_success') inquiries ${joins} JOIN json_each(CASE WHEN e.type='inquiry_success' THEN i.products ELSE json_array(e.product) END) p WHERE ${current.sql} AND p.value IN ('CBB60','CBB61','CBB65','CD60') GROUP BY p.value ORDER BY views DESC`).bind(...current.values),
  ]);
  const values = (index: number) => results[index].results;
  const currentMetrics = { ...numberRows(values(0)[0]), ...numberRows(values(2)[0]) };
  const previousMetrics = { ...numberRows(values(1)[0]), ...numberRows(values(3)[0]) };
  for (const set of [currentMetrics, previousMetrics]) set.conversion_rate = set.visitors ? Math.round(set.converted_visitors / set.visitors * 10000) / 100 : 0;
  const metrics = Object.fromEntries(Object.keys(currentMetrics).filter(key => key !== 'converted_visitors').map(key => [key, { current: currentMetrics[key], previous: previousMetrics[key], change: previousMetrics[key] ? Math.round((currentMetrics[key] - previousMetrics[key]) / previousMetrics[key] * 1000) / 10 : null }]));
  const daily = new Map(values(4).map(row => [String(row.day), numberRows(Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'day')))]));
  const trend = Array.from({ length: f.days }, (_, index) => {
    const timestamp = f.start + index * 86400000, date = new Date(timestamp + 8 * 3600000).toISOString().slice(0,10), previousDate = new Date(timestamp - f.days * 86400000 + 8 * 3600000).toISOString().slice(0,10);
    return { date, previousDate, current: daily.get(date) || {}, previous: daily.get(previousDate) || {} };
  });
  return { period: { from:f.from,to:f.to,days:f.days,timeZone:'Asia/Shanghai',previousFrom:new Date(f.previousStart+8*3600000).toISOString().slice(0,10),previousTo:new Date(f.start-1+8*3600000).toISOString().slice(0,10) }, metrics, trend, pages:values(5), countries:values(6), sources:values(7),channels:values(8),devices:values(9),products:values(10), includeInternal:f.includeInternal };
}
export async function facets(env: BackendEnv, url: URL) {
  const f = filters(url), values = [f.start, f.end];
  const queries = ['source','country','language'].map(column => env.DB.prepare(`SELECT DISTINCT ${column} value FROM events WHERE occurred_at>=? AND occurred_at<? AND is_bot=0 ${f.includeInternal?'':'AND is_internal=0'} ORDER BY ${column} LIMIT 100`).bind(...values));
  queries.push(env.DB.prepare(`SELECT DISTINCT country value FROM inquiries WHERE created_at>=? AND created_at<? ${f.includeInternal?'':'AND is_internal=0'} ORDER BY country LIMIT 100`).bind(...values));
  const results = await env.DB.batch<{ value: string }>(queries);
  return { sources:results[0].results.map(r=>r.value),countries:results[1].results.map(r=>r.value),languages:results[2].results.map(r=>r.value),inquiryCountries:results[3].results.map(r=>r.value) };
}
export async function visitors(env: BackendEnv, url: URL) {
  const f = filters(url), where = eventWhere(f), query = field(url.searchParams.get('q'), 60);
  const extra = query ? ' AND e.visitor_id LIKE ?' : '', params = [...where.values, ...(query ? [`%${query.replace(/[^a-f0-9-]/gi,'')}%`] : [])];
  const page = Math.min(1000,Math.max(1,Number(url.searchParams.get('page'))||1));
  const rows = await env.DB.prepare(`WITH matched AS(SELECT e.* ${joins} WHERE ${where.sql}${extra}),summary AS(SELECT visitor_id,MIN(occurred_at) first_seen,MAX(occurred_at) last_seen,COUNT(*) events,COUNT(DISTINCT visit_id) visits,SUM(type='inquiry_success') inquiries FROM matched GROUP BY visitor_id),latest AS(SELECT visitor_id,country,device,source,ROW_NUMBER() OVER(PARTITION BY visitor_id ORDER BY occurred_at DESC,id DESC) rn FROM matched) SELECT summary.*,latest.country,latest.device,latest.source FROM summary JOIN latest ON latest.visitor_id=summary.visitor_id AND latest.rn=1 ORDER BY summary.last_seen DESC LIMIT 25 OFFSET ?`).bind(...params,(page-1)*25).all();
  const count = await env.DB.prepare(`SELECT COUNT(DISTINCT e.visitor_id) total ${joins} WHERE ${where.sql}${extra}`).bind(...params).first<{total:number}>();
  return { items:rows.results,total:Number(count?.total||0),page,pageSize:25 };
}
export async function journey(env: BackendEnv, id: string, url: URL) {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new HttpError(404,'not_found','没有找到这个访客。');
  const visitor = await env.DB.prepare('SELECT * FROM visitors WHERE id=?').bind(id).first();
  if (!visitor) throw new HttpError(404,'not_found','没有找到这个访客。');
  let cursorTime=0,cursorId='';
  const cursor=url.searchParams.get('cursor');
  if(cursor){try{const parsed=JSON.parse(atob(cursor));cursorTime=Number(parsed[0]);cursorId=String(parsed[1]);}catch{throw new HttpError(400,'invalid_cursor','分页位置无效。');}}
  const rows=await env.DB.prepare(`SELECT id,occurred_at,received_at,visit_id,type,page,product,language,position,target,failure_code,inquiry_id,source,channel,country,device,is_internal FROM events WHERE visitor_id=? ${cursor?'AND (occurred_at>? OR (occurred_at=? AND id>?))':''} ORDER BY occurred_at,id LIMIT 101`).bind(id,...(cursor?[cursorTime,cursorTime,cursorId]:[])).all<RecordData>();
  const items=rows.results.slice(0,100),last=items[items.length-1];
  const inquiries=await env.DB.prepare('SELECT id,reference,created_at,status,name,company FROM inquiries WHERE visitor_id=? ORDER BY created_at DESC LIMIT 100').bind(id).all();
  return {visitor,items,inquiries:inquiries.results,nextCursor:rows.results.length>100&&last?btoa(JSON.stringify([last.occurred_at,last.id])):null};
}
