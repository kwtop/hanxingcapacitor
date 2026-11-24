import type { BackendEnv, RecordData, Visit } from './types';
import { cookie, cookies, language, localMode, pathOnly } from './http';
import { signId, verifyId } from './crypto';
import { visitorContext } from './visitorContext';
import { sourceInfo } from './attribution';
export { sourceInfo } from './attribution';

const uuid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i;
export function isBot(request: Request): boolean {
  const cf = (request as Request & { cf?: { botManagement?: { verifiedBot?: boolean; score?: number } } }).cf;
  return Boolean(cf?.botManagement?.verifiedBot || (cf?.botManagement?.score !== undefined && cf.botManagement.score < 10) || /bot\b|crawler|spider|headless|curl\/|wget\/|python-requests|selenium|playwright|facebookexternalhit|lighthouse/i.test(request.headers.get('User-Agent') || ''));
}
export async function ensureVisit(request: Request, env: BackendEnv, meta: RecordData = {}): Promise<{ visit: Visit; cookies: string[] }> {
  const jar = cookies(request), now = Date.now();
  let visitorId = await verifyId(env, jar.hx_visitor);
  if (!visitorId || !uuid.test(visitorId)) visitorId = uuid.test(String(meta.clientVisitorId)) ? String(meta.clientVisitorId) : crypto.randomUUID();
  const signedVisit = await verifyId(env, jar.hx_visit);
  const oldId = signedVisit || (uuid.test(String(meta.clientVisitId)) ? String(meta.clientVisitId) : null);
  let visit = oldId && uuid.test(oldId) ? await env.DB.prepare('SELECT * FROM visits WHERE id=? AND visitor_id=? AND last_seen>?').bind(oldId, visitorId, now - 30 * 60000).first<Visit>() : null;
  // Historical is_internal columns stay for compatibility; visits now share one reporting scope.
  const context = visitorContext(request, localMode(request, env));
  if (!visit) {
    const occupied=oldId?await env.DB.prepare('SELECT id FROM visits WHERE id=?').bind(oldId).first():null;
    const visitId=oldId&&!occupied?oldId:crypto.randomUUID();
    const ua = request.headers.get('User-Agent') || '';
    const device = !ua ? 'unknown' : /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'mobile' : /Windows|Macintosh|Linux|CrOS/i.test(ua) ? 'desktop' : 'unknown';
    visit = { id: visitId, visitor_id: visitorId, started_at: now, last_seen: now, entry_page: pathOnly(meta.page), ...sourceInfo(request, meta), ...context, device, language: language(meta.language), is_internal: 0, is_bot: Number(isBot(request)) };
    await env.DB.batch([
      env.DB.prepare('INSERT INTO visitors(id,first_seen,last_seen) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen').bind(visitorId, now, now),
      env.DB.prepare('INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,referrer_host,country,device,language,is_internal,is_bot,city,browser_language,referrer_url,utm_medium,utm_campaign) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen,is_internal=0,is_bot=MAX(visits.is_bot,excluded.is_bot) WHERE visits.visitor_id=excluded.visitor_id').bind(visit.id, visitorId, now, now, visit.entry_page, visit.source, visit.channel, visit.referrer_host, visit.country, device, visit.language, 0, visit.is_bot, visit.city, visit.browser_language, visit.referrer_url, visit.utm_medium, visit.utm_campaign),
    ]);
  } else {
    visit.is_internal = 0; visit.is_bot = Math.max(visit.is_bot, Number(isBot(request))); visit.last_seen = now;
    // A session already open at release can acquire missing context on its next request.
    if (visit.city === 'unknown' && visit.country === context.country) visit.city = context.city;
    if (visit.browser_language === 'unknown') visit.browser_language = context.browser_language;
    await env.DB.batch([
      env.DB.prepare('UPDATE visitors SET last_seen=? WHERE id=?').bind(now, visitorId),
      env.DB.prepare('UPDATE visits SET last_seen=?,is_internal=?,is_bot=?,city=?,browser_language=? WHERE id=?').bind(now, visit.is_internal, visit.is_bot, visit.city, visit.browser_language, visit.id),
    ]);
  }
  return { visit, cookies: [cookie(request, 'hx_visitor', await signId(env, visitorId), 180 * 86400), cookie(request, 'hx_visit', await signId(env, visit.id), 86400)] };
}
