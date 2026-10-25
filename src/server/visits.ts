import type { BackendEnv, RecordData, Visit } from './types';
import { cookie, cookies, field, language, localMode, pathOnly } from './http';
import { signId, verifyId } from './crypto';
import { identity } from './auth';
import { requestIp } from './rate';

const uuid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i;
export function isBot(request: Request): boolean {
  const cf = (request as Request & { cf?: { botManagement?: { verifiedBot?: boolean; score?: number } } }).cf;
  return Boolean(cf?.botManagement?.verifiedBot || (cf?.botManagement?.score !== undefined && cf.botManagement.score < 10) || /bot\b|crawler|spider|headless|curl\/|wget\/|python-requests|selenium|playwright|facebookexternalhit|lighthouse/i.test(request.headers.get('User-Agent') || ''));
}
export function sourceInfo(request: Request, meta: RecordData) {
  let host = '';
  try { host = new URL(field(meta.referrer, 240)).hostname.toLowerCase(); } catch { /* Unknown referrer. */ }
  const source = /^[a-z0-9_.-]{1,60}$/i.test(field(meta.utmSource, 61)) ? field(meta.utmSource, 60).toLowerCase() : '';
  const medium = field(meta.utmMedium, 40).toLowerCase();
  if (source) return { source, channel: /^(cpc|ppc|paidsearch|paid_search)$/.test(medium) ? 'paid_search' : /social/.test(medium) ? 'social' : /email/.test(medium) ? 'email' : /^(display|banner|cpm)$/.test(medium) ? 'display' : 'campaign', referrer_host: host };
  if (!host || host === new URL(request.url).hostname) return { source: 'direct_or_unknown', channel: 'direct_or_unknown', referrer_host: '' };
  if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com|baidu\.com|yandex\.[a-z.]+)$/.test(host)) return { source: host, channel: 'organic_search', referrer_host: host };
  return { source: host, channel: /(^|\.)(facebook\.com|instagram\.com|linkedin\.com|t\.co|x\.com|youtube\.com|pinterest\.com)$/.test(host) ? 'social' : 'referral', referrer_host: host };
}
export async function ensureVisit(request: Request, env: BackendEnv, meta: RecordData = {}): Promise<{ visit: Visit; cookies: string[] }> {
  const jar = cookies(request), now = Date.now();
  let visitorId = await verifyId(env, jar.hx_visitor);
  if (!visitorId || !uuid.test(visitorId)) visitorId = uuid.test(String(meta.clientVisitorId)) ? String(meta.clientVisitorId) : crypto.randomUUID();
  const signedVisit = await verifyId(env, jar.hx_visit);
  const oldId = signedVisit || (uuid.test(String(meta.clientVisitId)) ? String(meta.clientVisitId) : null);
  let visit = oldId && uuid.test(oldId) ? await env.DB.prepare('SELECT * FROM visits WHERE id=? AND visitor_id=? AND last_seen>?').bind(oldId, visitorId, now - 30 * 60000).first<Visit>() : null;
  const user = (jar.hx_admin || request.headers.has('Cf-Access-Jwt-Assertion') || jar.CF_Authorization) ? await identity(request, env) : null;
  const internal = localMode(request, env) || jar.hx_internal === '1' || !!user || (env.INTERNAL_IPS || '').split(',').map(v => v.trim()).filter(Boolean).includes(requestIp(request));
  if (!visit) {
    const occupied=oldId?await env.DB.prepare('SELECT id FROM visits WHERE id=?').bind(oldId).first():null;
    const visitId=oldId&&!occupied?oldId:crypto.randomUUID();
    const cf = (request as Request & { cf?: { country?: string } }).cf;
    const country = !localMode(request,env) && /^[A-Z]{2}$/.test(cf?.country || '') && !['XX','T1'].includes(cf!.country!) ? cf!.country! : 'unknown';
    const ua = request.headers.get('User-Agent') || '';
    const device = !ua ? 'unknown' : /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'mobile' : /Windows|Macintosh|Linux|CrOS/i.test(ua) ? 'desktop' : 'unknown';
    visit = { id: visitId, visitor_id: visitorId, started_at: now, last_seen: now, entry_page: pathOnly(meta.page), ...sourceInfo(request, meta), country, device, language: language(meta.language), is_internal: Number(internal), is_bot: Number(isBot(request)) };
    await env.DB.batch([
      env.DB.prepare('INSERT INTO visitors(id,first_seen,last_seen) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen').bind(visitorId, now, now),
      env.DB.prepare('INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,referrer_host,country,device,language,is_internal,is_bot) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen,is_internal=MAX(visits.is_internal,excluded.is_internal),is_bot=MAX(visits.is_bot,excluded.is_bot) WHERE visits.visitor_id=excluded.visitor_id').bind(visit.id, visitorId, now, now, visit.entry_page, visit.source, visit.channel, visit.referrer_host, country, device, visit.language, visit.is_internal, visit.is_bot),
    ]);
  } else {
    visit.is_internal = Math.max(visit.is_internal, Number(internal)); visit.is_bot = Math.max(visit.is_bot, Number(isBot(request))); visit.last_seen = now;
    await env.DB.batch([
      env.DB.prepare('UPDATE visitors SET last_seen=? WHERE id=?').bind(now, visitorId),
      env.DB.prepare('UPDATE visits SET last_seen=?,is_internal=?,is_bot=? WHERE id=?').bind(now, visit.is_internal, visit.is_bot, visit.id),
    ]);
  }
  return { visit, cookies: [cookie(request, 'hx_visitor', await signId(env, visitorId), 180 * 86400), cookie(request, 'hx_visit', await signId(env, visit.id), 86400)] };
}
