import type { BackendEnv, RecordData } from './types';
import { filters, eventWhere, inquiryFilters, inquiryWhere } from './filters';
import { field, HttpError } from './http';
const joins = 'FROM events e LEFT JOIN inquiries i ON i.id=e.inquiry_id';
const contactTypes = "('whatsapp_click','email_click','wechat_click','inquiry_click')";
const aggregate = `COUNT(DISTINCT e.visitor_id) visitors,COUNT(DISTINCT e.visit_id) visits,
  SUM(e.type='page_view') page_views,SUM(e.type IN ${contactTypes}) contact_clicks,
  SUM(e.type IN ('whatsapp_click','email_click')) whatsapp_email_clicks,
  SUM(e.type IN ('whatsapp_click','email_click','wechat_click')) messaging_clicks,
  SUM(e.type='whatsapp_click') whatsapp_clicks,SUM(e.type='email_click') email_clicks,SUM(e.type='wechat_click') wechat_clicks,
  COUNT(DISTINCT CASE WHEN e.type='form_start' THEN e.visitor_id END) form_starters,
  SUM(e.type='inquiry_success') inquiries,COUNT(DISTINCT CASE WHEN e.type='inquiry_success' THEN e.visitor_id END) converted_visitors`;
const numberRows = (row: RecordData | null) => Object.fromEntries(Object.entries(row || {}).map(([key,value]) => [key, Number(value || 0)]));
export async function overview(env: BackendEnv, url: URL) {
  const f = filters(url), current = eventWhere(f), previous = eventWhere(f, f.previousStart, f.start), both = eventWhere(f, f.previousStart, f.end);
  const hourly = f.days === 1, bucketFormat = hourly ? '%Y-%m-%d %H' : '%Y-%m-%d';
  const aggQuery = (where: typeof current) => env.DB.prepare(`SELECT ${aggregate} ${joins} WHERE ${where.sql}`).bind(...where.values);
  const returning = (where: typeof current, start: number) => env.DB.prepare(`SELECT COUNT(*) returning_visitors FROM (SELECT e.visitor_id,MIN(v.first_seen) first_seen,COUNT(DISTINCT e.visit_id) sessions ${joins} JOIN visitors v ON v.id=e.visitor_id WHERE ${where.sql} GROUP BY e.visitor_id HAVING first_seen<? OR sessions>1)`).bind(...where.values, start);
  const dimension = (column: string, limit = 12) => env.DB.prepare(`SELECT e.${column} label,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='page_view') views,SUM(e.type='inquiry_success') inquiries ${joins} WHERE ${current.sql} GROUP BY e.${column} ORDER BY views DESC,visitors DESC LIMIT ${limit}`).bind(...current.values);
  const results = await env.DB.batch<RecordData>([
    aggQuery(current), aggQuery(previous), returning(current,f.start), returning(previous,f.previousStart),
    env.DB.prepare(`SELECT strftime('${bucketFormat}',e.occurred_at/1000,'unixepoch','+8 hours') bucket,${aggregate} ${joins} WHERE ${both.sql} GROUP BY bucket ORDER BY bucket`).bind(...both.values),
    dimension('page',10),dimension('country'),dimension('source'),dimension('channel'),dimension('device'),
    env.DB.prepare(`SELECT p.value label,SUM(e.type='product_view') views,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='inquiry_success') inquiries ${joins} JOIN json_each(CASE WHEN e.type='inquiry_success' THEN i.products ELSE json_array(e.product) END) p WHERE ${current.sql} AND p.value IN ('CBB60','CBB61','CBB65','CD60') GROUP BY p.value ORDER BY views DESC`).bind(...current.values),
    env.DB.prepare(`SELECT e.type label,COUNT(*) actions,COUNT(DISTINCT e.visitor_id) visitors ${joins} WHERE ${current.sql} AND e.type IN ${contactTypes} GROUP BY e.type`).bind(...current.values),
    env.DB.prepare(`SELECT e.id,e.occurred_at,e.type,e.page,e.position,e.visitor_id,e.country ${joins} WHERE ${current.sql} AND e.type IN ${contactTypes} ORDER BY e.occurred_at DESC,e.id DESC LIMIT 12`).bind(...current.values),
    env.DB.prepare(`SELECT e.source,e.channel,COUNT(DISTINCT e.visit_id) visits,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='page_view') views ${joins} WHERE ${current.sql} GROUP BY e.source,e.channel ORDER BY views DESC,visits DESC,e.source,e.channel LIMIT 12`).bind(...current.values),
    env.DB.prepare(`SELECT e.source,e.channel,COUNT(DISTINCT e.visit_id) visits,COUNT(DISTINCT e.visitor_id) visitors,SUM(e.type='page_view') views ${joins} WHERE ${current.sql} AND e.channel='organic_search' GROUP BY e.source,e.channel ORDER BY views DESC,visits DESC,e.source LIMIT 8`).bind(...current.values),
  ]);
  const values = (index: number) => results[index].results;
  const currentMetrics = { ...numberRows(values(0)[0]), ...numberRows(values(2)[0]) };
  const previousMetrics = { ...numberRows(values(1)[0]), ...numberRows(values(3)[0]) };
  for (const set of [currentMetrics, previousMetrics]) set.conversion_rate = set.visitors ? Math.round(set.converted_visitors / set.visitors * 10000) / 100 : 0;
  const metrics = Object.fromEntries(Object.keys(currentMetrics).filter(key => key !== 'converted_visitors').map(key => [key, { current: currentMetrics[key], previous: previousMetrics[key], change: previousMetrics[key] ? Math.round((currentMetrics[key] - previousMetrics[key]) / previousMetrics[key] * 1000) / 10 : null }]));
  const buckets = new Map(values(4).map(row => [String(row.bucket), numberRows(Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'bucket')))]));
  const generatedAt = Date.now(), interval = hourly ? 3600000 : 86400000;
  const trend = Array.from({ length: hourly ? 24 : f.days }, (_, index) => {
    const timestamp = f.start + index * interval, previousTimestamp = timestamp - f.days * 86400000;
    const date = new Date(timestamp + 8 * 3600000).toISOString().slice(0,10), previousDate = new Date(previousTimestamp + 8 * 3600000).toISOString().slice(0,10);
    const suffix = hourly ? ` ${String(index).padStart(2,'0')}` : '';
    return { date, previousDate, ...(hourly ? {hour:index,currentPartial:timestamp <= generatedAt && generatedAt < timestamp + interval,previousPartial:previousTimestamp <= generatedAt && generatedAt < previousTimestamp + interval} : {}),
      current: hourly && timestamp > generatedAt ? null : buckets.get(date + suffix) || {},
      previous: hourly && previousTimestamp > generatedAt ? null : buckets.get(previousDate + suffix) || {} };
  });
  return { period: { from:f.from,to:f.to,days:f.days,timeZone:'Asia/Shanghai',previousFrom:new Date(f.previousStart+8*3600000).toISOString().slice(0,10),previousTo:new Date(f.start-1+8*3600000).toISOString().slice(0,10) }, generatedAt, trendGranularity:hourly ? 'hour' : 'day', metrics, trend, pages:values(5), countries:values(6), sources:values(7),channels:values(8),devices:values(9),products:values(10),contactActions:values(11),recentContacts:values(12),sourceDetails:values(13),organicSources:values(14) };
}

// One source row represents a visit; one contact row represents an action.
// Both inherit the exact overview window and exclusion filters.
export async function records(env: BackendEnv, url: URL) {
  const f = filters(url), where = eventWhere(f), kind = url.searchParams.get('kind') || 'source';
  if (!['source','contact'].includes(kind)) throw new HttpError(400,'invalid_kind','明细类型无效。');
  const page = Number(url.searchParams.get('page') || 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) throw new HttpError(400,'invalid_page','页码无效。');
  const clauses = [where.sql], values = [...where.values];
  let positionsQuery;
  if (kind === 'contact') {
    clauses.push(`e.type IN ${contactTypes}`);
    const type = url.searchParams.get('contact_type');
    if (type) {
      if (!['whatsapp_click','email_click','wechat_click','inquiry_click'].includes(type)) throw new HttpError(400,'invalid_contact_type','联系入口无效。');
      clauses.push('e.type=?'); values.push(type);
    }
    const eventPage = field(url.searchParams.get('event_page'), 240);
    if (eventPage) {clauses.push('e.page=?');values.push(eventPage);}
    positionsQuery = env.DB.prepare(`SELECT DISTINCT e.position ${joins} WHERE ${clauses.join(' AND ')} ORDER BY e.position LIMIT 100`).bind(...values);
    const position = field(url.searchParams.get('position'), 240);
    if (position) {clauses.push('e.position=?');values.push(position);}
  }
  const matched = `SELECT e.* ${joins} WHERE ${clauses.join(' AND ')}`;
  const visitFields = 'v.entry_page,v.referrer_host,v.referrer_url,v.utm_medium,v.utm_campaign,v.city,v.browser_language';
  const result = await env.DB.batch<RecordData>([
    env.DB.prepare(kind === 'contact'
      ? `WITH matched AS(${matched}) SELECT e.id,e.occurred_at,e.type,e.page,e.position,e.visitor_id,e.visit_id,e.source,e.channel,e.country,e.device,e.language,${visitFields} FROM matched e JOIN visits v ON v.id=e.visit_id ORDER BY e.occurred_at DESC,e.id DESC LIMIT 25 OFFSET ?`
      : `WITH matched AS(${matched}),summary AS(SELECT visit_id,MIN(id) id,MIN(occurred_at) first_seen,MAX(occurred_at) occurred_at,SUM(type='page_view') page_views,COUNT(*) events FROM matched GROUP BY visit_id) SELECT summary.*,v.visitor_id,v.source,v.channel,v.country,v.device,v.language,${visitFields} FROM summary JOIN visits v ON v.id=summary.visit_id ORDER BY summary.occurred_at DESC,summary.visit_id DESC LIMIT 25 OFFSET ?`).bind(...values,(page-1)*25),
    env.DB.prepare(`WITH matched AS(${matched}) SELECT ${kind === 'contact' ? 'COUNT(*)' : 'COUNT(DISTINCT visit_id)'} total,COUNT(DISTINCT visitor_id) visitors,SUM(type='page_view') page_views FROM matched`).bind(...values),
    ...(positionsQuery ? [positionsQuery] : []),
  ]);
  const summary = numberRows(result[1].results[0]);
  return {kind,items:result[0].results,total:summary.total,summary,page,pageSize:25,timeZone:'Asia/Shanghai',positions:result[2]?.results.map(row=>String(row.position)) || []};
}
export async function facets(env: BackendEnv, url: URL) {
  if (url.searchParams.get('scope') === 'inquiries') {
    const where = inquiryWhere(inquiryFilters(url));
    const results = await env.DB.batch<{ value: string }>(['source','country','language'].map(column => env.DB.prepare(`SELECT DISTINCT i.${column} value FROM inquiries i WHERE ${where.sql} ORDER BY i.${column} LIMIT 100`).bind(...where.values)));
    return { sources:results[0].results.map(r=>r.value),countries:results[1].results.map(r=>r.value),languages:results[2].results.map(r=>r.value),inquiryCountries:results[1].results.map(r=>r.value) };
  }
  const f = filters(url), values = [f.start, f.end];
  const queries = ['source','country','language'].map(column => env.DB.prepare(`SELECT DISTINCT ${column} value FROM events WHERE occurred_at>=? AND occurred_at<? AND is_bot=0 ORDER BY ${column} LIMIT 100`).bind(...values));
  queries.push(env.DB.prepare(`SELECT DISTINCT country value FROM inquiries WHERE created_at>=? AND created_at<? ORDER BY country LIMIT 100`).bind(...values));
  const results = await env.DB.batch<{ value: string }>(queries);
  return { sources:results[0].results.map(r=>r.value),countries:results[1].results.map(r=>r.value),languages:results[2].results.map(r=>r.value),inquiryCountries:results[3].results.map(r=>r.value) };
}
export async function visitors(env: BackendEnv, url: URL) {
  const f = filters(url), where = eventWhere(f), query = field(url.searchParams.get('q'), 60);
  const extra = query ? ' AND e.visitor_id LIKE ?' : '', params = [...where.values, ...(query ? [`%${query.replace(/[^a-f0-9-]/gi,'')}%`] : [])];
  const page = Math.min(1000,Math.max(1,Number(url.searchParams.get('page'))||1));
  const matched = `SELECT e.*,strftime('%Y-%m-%d',e.occurred_at/1000,'unixepoch','+8 hours') day ${joins} WHERE ${where.sql}${extra}`;
  const results = await env.DB.batch([
    env.DB.prepare(`WITH matched AS(${matched}),
      summary AS(SELECT day,visitor_id,MIN(occurred_at) first_seen,MAX(occurred_at) last_seen,COUNT(*) events,COUNT(DISTINCT visit_id) visits,SUM(type='page_view') page_views FROM matched GROUP BY day,visitor_id),
      latest AS(SELECT day,visitor_id,visit_id,country,device,source,ROW_NUMBER() OVER(PARTITION BY day,visitor_id ORDER BY occurred_at DESC,id DESC) rn FROM matched)
      SELECT summary.*,latest.country,latest.device,latest.source,
        COALESCE(v.city,'unknown') city,COALESCE(v.browser_language,'unknown') browser_language,
        (summary.visits>1 OR person.first_seen<CAST(strftime('%s',summary.day,'-8 hours') AS INTEGER)*1000) is_returning
      FROM summary JOIN latest ON latest.visitor_id=summary.visitor_id AND latest.day=summary.day AND latest.rn=1
      LEFT JOIN visits v ON v.id=latest.visit_id JOIN visitors person ON person.id=summary.visitor_id
      ORDER BY summary.last_seen DESC,summary.visitor_id LIMIT 25 OFFSET ?`).bind(...params,(page-1)*25),
    env.DB.prepare(`WITH matched AS(${matched}) SELECT (SELECT COUNT(*) FROM (SELECT day,visitor_id FROM matched GROUP BY day,visitor_id)) total,COUNT(DISTINCT visitor_id) unique_visitors FROM matched`).bind(...params),
  ]);
  const count = results[1].results[0] as {total:number;unique_visitors:number};
  return { items:results[0].results,total:Number(count?.total||0),uniqueVisitors:Number(count?.unique_visitors||0),page,pageSize:25,timeZone:'Asia/Shanghai',grouping:'visitor_day' };
}
export async function journey(env: BackendEnv, id: string, url: URL) {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new HttpError(404,'not_found','没有找到这个访客。');
  const visitor = await env.DB.prepare('SELECT * FROM visitors WHERE id=?').bind(id).first();
  if (!visitor) throw new HttpError(404,'not_found','没有找到这个访客。');
  const selectedDay = url.searchParams.get('day') || '';
  let scope = 'e.visitor_id=? AND e.is_bot=0';
  const scopeValues: (string | number)[] = [id];
  if (selectedDay) {
    // Reuse Beijing-date validation and boundaries, independently of the cursor.
    const dayUrl = new URL(url); dayUrl.searchParams.set('from',selectedDay); dayUrl.searchParams.set('to',selectedDay);
    const dayFilters = filters(dayUrl);
    scope += ' AND e.occurred_at>=? AND e.occurred_at<?';scopeValues.push(dayFilters.start,dayFilters.end);
  }
  let cursorTime=0,cursorId='';
  const cursor=url.searchParams.get('cursor');
  if(cursor){try{const parsed=JSON.parse(atob(cursor));cursorTime=Number(parsed[0]);cursorId=String(parsed[1]);if(!Number.isSafeInteger(cursorTime)||!/^[a-f0-9-]{36}$/i.test(cursorId))throw new Error('invalid');}catch{throw new HttpError(400,'invalid_cursor','分页位置无效。');}}
  const projection = `e.id,e.occurred_at,e.received_at,e.visit_id,e.type,e.page,e.product,e.language,e.position,e.target,e.failure_code,e.inquiry_id,e.source,e.channel,e.country,e.device,COALESCE(v.city,'unknown') city,COALESCE(v.browser_language,'unknown') browser_language,v.entry_page,v.referrer_host,v.referrer_url,v.utm_medium,v.utm_campaign`;
  const queries = await env.DB.batch<RecordData>([
    env.DB.prepare(`SELECT ${projection} FROM events e LEFT JOIN visits v ON v.id=e.visit_id WHERE ${scope} ${cursor?'AND (e.occurred_at>? OR (e.occurred_at=? AND e.id>?))':''} ORDER BY e.occurred_at,e.id LIMIT 101`).bind(...scopeValues,...(cursor?[cursorTime,cursorTime,cursorId]:[])),
    env.DB.prepare(`SELECT COUNT(*) events,COUNT(DISTINCT e.visit_id) visits,SUM(e.type='page_view') page_views,SUM(e.type IN ${contactTypes}) contact_clicks,MIN(e.occurred_at) first_seen,MAX(e.occurred_at) last_seen FROM events e WHERE ${scope}`).bind(...scopeValues),
    env.DB.prepare(`SELECT ${projection} FROM events e LEFT JOIN visits v ON v.id=e.visit_id WHERE ${scope} ORDER BY e.occurred_at DESC,e.id DESC LIMIT 1`).bind(...scopeValues),
  ]);
  const focus = url.searchParams.get('focus_event');
  if (focus && !/^[a-f0-9-]{36}$/i.test(focus)) throw new HttpError(400,'invalid_event','操作编号无效。');
  const focusEvent = focus ? await env.DB.prepare(`SELECT ${projection} FROM events e LEFT JOIN visits v ON v.id=e.visit_id WHERE ${scope} AND e.id=?`).bind(...scopeValues,focus).first<RecordData>() : null;
  const items=queries[0].results.slice(0,100),last=items[items.length-1];
  const inquiries=await env.DB.prepare('SELECT id,reference,created_at,status,name,company FROM inquiries WHERE visitor_id=? ORDER BY created_at DESC LIMIT 100').bind(id).all();
  return {visitor,items,focusEvent,context:focusEvent || queries[2].results[0] || null,summary:{...numberRows(queries[1].results[0]),day:selectedDay || null},inquiries:inquiries.results,nextCursor:queries[0].results.length>100&&last?btoa(JSON.stringify([last.occurred_at,last.id])):null};
}
