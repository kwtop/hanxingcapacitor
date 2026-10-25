import type { BackendEnv, RecordData } from './types';
import { inquiryProducts } from './types';
import { equal, hmac } from './crypto';
import { field, HttpError, language, localMode, pathOnly } from './http';
import { ensureVisit, isBot } from './visits';
import { rateLimit, requestIp } from './rate';

export async function formConfig(request: Request, env: BackendEnv) {
  await rateLimit(request, env, 'form_config', 45, 600);
  const local = localMode(request, env);
  if (!local && (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || /^1x00000000000000000000/.test(env.TURNSTILE_SITE_KEY))) throw new HttpError(503, 'spam_protection_missing', '询盘服务尚未配置完成。');
  const payload = btoa(JSON.stringify({ time: Date.now(), nonce: crypto.randomUUID() }));
  return { siteKey: local ? null : env.TURNSTILE_SITE_KEY, formToken: `${payload}.${await hmac(env, `form:${payload}`)}`, minimumSeconds: 2 };
}
async function validateProof(request: Request, env: BackendEnv, token: string, challenge: string) {
  const [value, signature] = token.split('.');
  if (!value || !signature || !equal(await hmac(env, `form:${value}`), signature)) throw new HttpError(400, 'form_expired', '请刷新表单后重试。');
  let createdAt = 0;
  try { createdAt = Number(JSON.parse(atob(value)).time); } catch { /* Invalid proof. */ }
  const age = Date.now() - createdAt;
  if (!Number.isFinite(age) || age < 1800 || age > 3600000) throw new HttpError(400, 'form_expired', '请等待片刻或刷新表单后重试。');
  if (localMode(request, env)) return;
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || /^1x00000000000000000000/.test(env.TURNSTILE_SITE_KEY)) throw new HttpError(503, 'spam_protection_missing', '询盘服务尚未配置完成。');
  if (!challenge || challenge.length > 2048) throw new HttpError(400, 'captcha_required', '请完成验证后重试。');
  let result: { success?: boolean; hostname?: string; action?: string };
  try {
    const payload = new FormData(); payload.set('secret', env.TURNSTILE_SECRET_KEY); payload.set('response', challenge);
    const ip = requestIp(request); if (ip !== 'unavailable') payload.set('remoteip', ip);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: payload, signal: AbortSignal.timeout(8000) });
    result = await response.json();
  } catch { throw new HttpError(503, 'captcha_unavailable', '验证服务暂时不可用，请重试。'); }
  const originHost = request.headers.get('Origin') ? new URL(request.headers.get('Origin')!).hostname : new URL(request.url).hostname;
  if (!result.success || result.hostname !== originHost || result.action !== 'inquiry') throw new HttpError(400, 'captcha_failed', '验证已失效，请重新验证。');
}

export async function submitInquiry(request: Request, env: BackendEnv, body: RecordData) {
  if (field(body.website, 200) || isBot(request)) throw new HttpError(400, 'rejected', '无法处理这次提交。');
  const name = field(body.name, 120), company = field(body.company, 160), email = field(body.email, 200).toLowerCase(), phone = field(body.phone, 80);
  const country = field(body.country, 100), message = field(body.message, 4000);
  const selected = [...new Set((Array.isArray(body.products) ? body.products : []).filter(v => inquiryProducts.includes(v as typeof inquiryProducts[number])))].sort() as string[];
  if (selected.includes('unknown') && selected.length > 1) throw new HttpError(400, 'validation', '请选择具体产品，或仅选择尚未确定。');
  if (!name || !country || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !selected.length) throw new HttpError(400, 'validation', '请填写姓名、有效邮箱、国家、产品和至少 10 个字符的需求。');
  const idempotency = field(body.idempotencyKey, 80);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idempotency)) throw new HttpError(400, 'invalid_idempotency', '提交编号无效，请刷新表单。');
  const context = field(body.context, 1000);
  const payloadHash = await hmac(env, JSON.stringify([name, company, email, phone, country, selected, message, context]));
  const keyHash = await hmac(env, `idempotency:${idempotency}`);
  const existing = await env.DB.prepare('SELECT id,reference,payload_hash FROM inquiries WHERE idempotency_hash=?').bind(keyHash).first<{ id: string; reference: string; payload_hash: string }>();
  if (existing) {
    if (!equal(existing.payload_hash, payloadHash)) throw new HttpError(409, 'idempotency_conflict', '这个提交编号已使用，请重新发起询盘。');
    return { id: existing.id, reference: existing.reference, duplicate: true, cookies: [] as string[] };
  }
  const prior = await env.DB.prepare('SELECT i.id,i.reference FROM inquiry_dedupes d JOIN inquiries i ON i.id=d.inquiry_id WHERE d.fingerprint=? AND d.expires_at>?').bind(payloadHash, Date.now()).first<{ id: string; reference: string }>();
  if (prior) return { ...prior, duplicate: true, cookies: [] as string[] };
  await rateLimit(request, env, 'inquiry', 5, 900);
  await validateProof(request, env, field(body.formToken, 800), field(body.turnstileToken, 2048));
  const { visit, cookies } = await ensureVisit(request, env, { ...body, page: pathOnly(body.page) });
  await rateLimit(request, env, 'inquiry_visitor', 12, 86400, visit.visitor_id);
  const id = crypto.randomUUID(), now = Date.now();
  const reference = `HX-${new Date(now).toISOString().slice(0, 10).replaceAll('-', '')}-${id.slice(0, 8).toUpperCase()}`;
  const page = pathOnly(body.page), sourcePage = pathOnly(body.sourcePage || page), lang = language(body.language);
  try {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO inquiry_dedupes(fingerprint,inquiry_id,expires_at) VALUES(?,?,?) ON CONFLICT(fingerprint) DO UPDATE SET inquiry_id=excluded.inquiry_id,expires_at=excluded.expires_at WHERE inquiry_dedupes.expires_at<=?').bind(payloadHash, id, now + 15 * 60000, now),
      env.DB.prepare(`INSERT INTO inquiries(id,reference,created_at,updated_at,name,company,email,phone,country,products,message,context,submission_page,source_page,language,source,channel,visitor_id,visit_id,is_internal,idempotency_hash,payload_hash)
        SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM inquiry_dedupes WHERE fingerprint=? AND inquiry_id=?)`).bind(id, reference, now, now, name, company, email, phone, country, JSON.stringify(selected), message, context, page, sourcePage, lang, visit.source, visit.channel, visit.visitor_id, visit.id, visit.is_internal, keyHash, payloadHash, payloadHash, id),
      env.DB.prepare(`INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,product,language,position,target,failure_code,inquiry_id,source,channel,country,device,is_internal,is_bot)
        SELECT ?,created_at,created_at,visitor_id,visit_id,'inquiry_success',submission_page,?,language,'contact_form','','',id,source,channel,?,?,is_internal,0 FROM inquiries WHERE id=? ON CONFLICT(id) DO NOTHING`).bind(`inquiry:${id}`, selected.length === 1 ? selected[0] : 'unknown', visit.country, visit.device, id),
    ]);
  } catch (error) {
    const duplicate = await env.DB.prepare('SELECT id,reference,payload_hash FROM inquiries WHERE idempotency_hash=?').bind(keyHash).first<{ id: string; reference: string; payload_hash: string }>();
    if (duplicate && equal(duplicate.payload_hash, payloadHash)) return { id: duplicate.id, reference: duplicate.reference, duplicate: true, cookies };
    throw error;
  }
  const saved = await env.DB.prepare('SELECT id,reference FROM inquiries WHERE id=?').bind(id).first<{ id: string; reference: string }>();
  if (!saved) {
    const duplicate = await env.DB.prepare('SELECT i.id,i.reference FROM inquiry_dedupes d JOIN inquiries i ON i.id=d.inquiry_id WHERE d.fingerprint=?').bind(payloadHash).first<{ id: string; reference: string }>();
    if (duplicate) return { ...duplicate, duplicate: true, cookies };
    throw new HttpError(500, 'save_failed', '询盘保存失败，请重试。');
  }
  return { ...saved, duplicate: false, cookies };
}
