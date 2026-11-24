import { field, HttpError } from './http';
export interface DimensionFilters {
  source: string; channel: string; country: string; product: string; language: string;
}
export interface Filters extends DimensionFilters {
  from: string; to: string; start: number; end: number; previousStart: number; days: number;
}
const day = 86400000;
export function inquiryFilters(url: URL): DimensionFilters {
  const read = (name: string) => field(url.searchParams.get(name), 100);
  const channel = read('channel');
  if (channel && !['organic_search','paid_search','social','email','referral','campaign','display','direct_or_unknown'].includes(channel)) throw new HttpError(400,'invalid_channel','渠道无效。');
  return { source: read('source'), channel, country: read('country'), product: read('product'), language: read('language') };
}
export function filters(url: URL): Filters {
  const today = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  const to = url.searchParams.get('to') || today;
  const from = url.searchParams.get('from') || to;
  if (![from, to].every(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(Date.parse(v)).toISOString().slice(0, 10) === v)) throw new HttpError(400, 'invalid_dates', '日期格式无效。');
  const start = Date.parse(`${from}T00:00:00+08:00`), end = Date.parse(`${to}T00:00:00+08:00`) + day;
  const days = Math.round((end - start) / day);
  if (days < 1 || days > 93) throw new HttpError(400, 'invalid_range', '请选择 1 至 93 天的日期范围。');
  return { from, to, start, end, previousStart: start - days * day, days, ...inquiryFilters(url) };
}
export function eventWhere(f: Filters, start = f.start, end = f.end) {
  const clauses = ['e.occurred_at>=?', 'e.occurred_at<?', 'e.is_bot=0', "(e.type<>'inquiry_success' OR i.status<>'spam')"];
  const values: (string | number)[] = [start, end];
  for (const key of ['source','channel','country','language'] as const) if (f[key]) { clauses.push(`e.${key}=?`); values.push(f[key]); }
  if (f.product) { clauses.push("((e.type<>'inquiry_success' AND e.product=?) OR (e.type='inquiry_success' AND EXISTS(SELECT 1 FROM json_each(i.products) WHERE value=?)))"); values.push(f.product, f.product); }
  return { sql: clauses.join(' AND '), values };
}
export function inquiryWhere(f: DimensionFilters, url?: URL) {
  // The inbox and CSV cover all saved inquiries, independently of analytics dates.
  const clauses = ['1=1']; const values: (string | number)[] = [];
  for (const key of ['source','channel','country','language'] as const) if (f[key]) { clauses.push(`i.${key}=?`); values.push(f[key]); }
  if (f.product) { clauses.push('EXISTS(SELECT 1 FROM json_each(i.products) WHERE value=?)'); values.push(f.product); }
  const status = url?.searchParams.get('status');
  if (status) {
    if (!['pending','following','completed','spam'].includes(status)) throw new HttpError(400, 'invalid_status', '状态无效。');
    clauses.push('i.status=?'); values.push(status);
  }
  if (url?.searchParams.get('unread') === '1') clauses.push('i.read_at IS NULL');
  const search = field(url?.searchParams.get('q'), 100);
  if (search) {
    clauses.push("(i.name LIKE ? ESCAPE '\\' OR i.company LIKE ? ESCAPE '\\' OR i.email LIKE ? ESCAPE '\\' OR i.phone LIKE ? ESCAPE '\\' OR i.message LIKE ? ESCAPE '\\' OR i.reference LIKE ? ESCAPE '\\')");
    const query = `%${search.replace(/[\\%_]/g, '\\$&')}%`; values.push(...Array(6).fill(query));
  }
  return { sql: clauses.join(' AND '), values };
}
