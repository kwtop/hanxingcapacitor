import type { AdminIdentity, BackendEnv, RecordData } from './types';
import { field, HttpError } from './http';
import { filters, inquiryWhere } from './filters';

export async function listInquiries(env: BackendEnv, url: URL) {
  const f = filters(url), where = inquiryWhere(f, url);
  const page = Math.min(1000, Math.max(1, Number(url.searchParams.get('page')) || 1));
  const count = await env.DB.prepare(`SELECT COUNT(*) total,SUM(read_at IS NULL) unread FROM inquiries i WHERE ${where.sql}`).bind(...where.values).first<{ total: number; unread: number }>();
  const rows = await env.DB.prepare(`SELECT id,reference,created_at,name,company,email,phone,country,products,status,read_at,source,channel,language,is_internal FROM inquiries i WHERE ${where.sql} ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?`).bind(...where.values, (page - 1) * 25).all();
  return { items: rows.results, total: Number(count?.total || 0), unread: Number(count?.unread || 0), page, pageSize: 25 };
}
export async function inquiryDetail(env: BackendEnv, id: string) {
  const inquiry = await env.DB.prepare('SELECT * FROM inquiries WHERE id=?').bind(id).first<RecordData>();
  if (!inquiry) throw new HttpError(404, 'not_found', '没有找到这条询盘。');
  delete inquiry.idempotency_hash; delete inquiry.payload_hash;
  const notes = await env.DB.prepare('SELECT id,created_at,author,note FROM inquiry_notes WHERE inquiry_id=? ORDER BY created_at DESC,id DESC LIMIT 200').bind(id).all();
  const activity = await env.DB.prepare('SELECT created_at,author,action,value FROM inquiry_activity WHERE inquiry_id=? ORDER BY created_at DESC LIMIT 100').bind(id).all();
  return { ...inquiry, notes: notes.results, activity: activity.results };
}
export async function updateInquiry(env: BackendEnv, id: string, data: RecordData, user: AdminIdentity) {
  const row = await env.DB.prepare('SELECT status,read_at,version FROM inquiries WHERE id=?').bind(id).first<{ status: string; read_at: number | null; version: number }>();
  if (!row) throw new HttpError(404, 'not_found', '没有找到这条询盘。');
  if (data.version !== row.version) throw new HttpError(409, 'version_conflict', '询盘已被更新，请刷新后重试。');
  if (data.status !== undefined && !['pending','following','completed','spam'].includes(String(data.status))) throw new HttpError(400, 'invalid_status', '状态无效。');
  if (data.read !== undefined && typeof data.read !== 'boolean') throw new HttpError(400, 'invalid_read', '未读标记无效。');
  const now = Date.now(), status = String(data.status || row.status), readAt = data.read === undefined ? row.read_at : data.read ? now : null;
  const result = await env.DB.prepare('UPDATE inquiries SET status=?,read_at=?,updated_at=?,version=version+1 WHERE id=? AND version=? RETURNING version').bind(status, readAt, now, id, row.version).first<{ version: number }>();
  if (!result) throw new HttpError(409, 'version_conflict', '询盘已被更新，请刷新后重试。');
  await env.DB.prepare('INSERT INTO inquiry_activity(id,inquiry_id,created_at,author,action,value) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(), id, now, user.email, 'update', JSON.stringify({ status, read: readAt !== null })).run();
  return { version: result.version, status, read_at: readAt };
}
export async function addNote(env: BackendEnv, id: string, data: RecordData, user: AdminIdentity) {
  const note = field(data.note, 2000);
  if (!note) throw new HttpError(400, 'empty_note', '请填写跟进备注。');
  if (!await env.DB.prepare('SELECT id FROM inquiries WHERE id=?').bind(id).first()) throw new HttpError(404, 'not_found', '没有找到这条询盘。');
  const value = { id: crypto.randomUUID(), created_at: Date.now(), author: user.email, note };
  await env.DB.prepare('INSERT INTO inquiry_notes(id,inquiry_id,created_at,author,note) VALUES(?,?,?,?,?)').bind(value.id, id, value.created_at, value.author, note).run();
  return value;
}
function csvCell(value: unknown) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
export async function exportInquiries(env: BackendEnv, url: URL) {
  const where = inquiryWhere(filters(url), url);
  const count = await env.DB.prepare(`SELECT COUNT(*) total FROM inquiries i WHERE ${where.sql}`).bind(...where.values).first<{ total: number }>();
  if (Number(count?.total) > 2000) throw new HttpError(422, 'export_limit', '单次最多导出 2000 条，请缩小日期或筛选范围。');
  const rows = await env.DB.prepare(`SELECT i.*,(SELECT GROUP_CONCAT(n.author || '：' || n.note, char(10)) FROM inquiry_notes n WHERE n.inquiry_id=i.id) AS notes FROM inquiries i WHERE ${where.sql} ORDER BY i.created_at DESC LIMIT 2000`).bind(...where.values).all<RecordData>();
  const header = ['询盘编号','提交时间（北京时间）','姓名','公司','邮箱','电话','客户国家','产品','需求','状态','是否未读','提交页面','来源页面','语言','访问来源','渠道','匿名访客编号','跟进备注'];
  const statusLabels: Record<string,string> = { pending: '待处理', following: '跟进中', completed: '已完成', spam: '垃圾询盘' };
  const lines = rows.results.map(row => [row.reference, new Date(Number(row.created_at) + 8 * 3600000).toISOString().replace('T',' ').slice(0,19), row.name,row.company,row.email,row.phone,row.country,JSON.parse(String(row.products)).map((product: string) => product === 'unknown' ? '未知' : product).join(' / '),row.message,statusLabels[String(row.status)],row.read_at ? '否' : '是',row.submission_page,row.source_page,row.language,row.source,row.channel,row.visitor_id,row.notes].map(csvCell).join(','));
  return '\uFEFF' + [header.map(csvCell).join(','), ...lines].join('\r\n');
}
