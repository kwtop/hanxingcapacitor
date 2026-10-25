import { field, HttpError } from './http';
export interface Filters {
  from: string; to: string; start: number; end: number; previousStart: number; days: number;
  source: string; country: string; product: string; language: string; includeInternal: boolean;
}
const day = 86400000;
export function filters(url: URL): Filters {
  const today = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  const to = url.searchParams.get('to') || today;
  const from = url.searchParams.get('from') || new Date(Date.parse(today) - 6 * day).toISOString().slice(0, 10);
  if (![from, to].every(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(Date.parse(v)).toISOString().slice(0, 10) === v)) throw new HttpError(400, 'invalid_dates', '日期格式无效。');
  const start = Date.parse(`${from}T00:00:00+08:00`), end = Date.parse(`${to}T00:00:00+08:00`) + day;
  const days = Math.round((end - start) / day);
  if (days < 1 || days > 93) throw new HttpError(400, 'invalid_range', '请选择 1 至 93 天的日期范围。');
  const read = (name: string) => field(url.searchParams.get(name), 100);
  return { from, to, start, end, previousStart: start - days * day, days, source: read('source'), country: read('country'), product: read('product'), language: read('language'), includeInternal: url.searchParams.get('include_internal') === '1' };
}
export function eventWhere(f: Filters, start = f.start, end = f.end) {
  const clauses = ['e.occurred_at>=?', 'e.occurred_at<?', 'e.is_bot=0', "(e.type<>'inquiry_success' OR i.status<>'spam')"];
  const values: (string | number)[] = [start, end];
  if (!f.includeInternal) clauses.push('e.is_internal=0');
  for (const key of ['source','country','language'] as const) if (f[key]) { clauses.push(`e.${key}=?`); values.push(f[key]); }
  if (f.product) { clauses.push("((e.type<>'inquiry_success' AND e.product=?) OR (e.type='inquiry_success' AND EXISTS(SELECT 1 FROM json_each(i.products) WHERE value=?)))"); values.push(f.product, f.product); }
  return { sql: clauses.join(' AND '), values };
}
export function inquiryWhere(f: Filters, url?: URL) {
  const clauses = ['i.created_at>=?', 'i.created_at<?']; const values: (string | number)[] = [f.start, f.end];
  if (!f.includeInternal) clauses.push('i.is_internal=0');
  for (const key of ['source','country','language'] as const) if (f[key]) { clauses.push(`i.${key}=?`); values.push(f[key]); }
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
