import type { BackendEnv, RecordData, Visit } from './types';
import { publicEvents } from './types';
import { field, HttpError, language, pathOnly, productCode } from './http';
import { ensureVisit } from './visits';
import { rateLimit } from './rate';

export function eventStatement(env: BackendEnv, visit: Visit, value: RecordData, now: number, inquiryId: string | null = null) {
  const position = /^[a-z0-9_:-]{1,60}$/i.test(field(value.position, 61)) ? field(value.position, 60) : 'unknown';
  const failure = ['validation', 'network', 'server', 'captcha', 'rate_limited'].includes(String(value.failureCode)) ? String(value.failureCode) : '';
  // Delayed beacons retain action order. Reject implausible client clocks and
  // keep a separate authoritative receipt time; inquiry success always uses server time.
  const clientTime = Number(value.occurredAt);
  const occurredAt = Number.isSafeInteger(clientTime) && clientTime >= now - 86400000 && clientTime <= now + 120000 ? Math.min(clientTime,now) : now;
  return env.DB.prepare('INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,product,language,position,target,failure_code,inquiry_id,source,channel,country,device,is_internal,is_bot) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING')
    .bind(value.id, occurredAt, now, visit.visitor_id, visit.id, value.type, pathOnly(value.page), productCode(value.product), language(value.language), position, value.target ? pathOnly(value.target) : '', failure, inquiryId, visit.source, visit.channel, visit.country, visit.device, visit.is_internal, visit.is_bot);
}
export async function collect(request: Request, env: BackendEnv, body: RecordData) {
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 20) throw new HttpError(400, 'invalid_events', '事件格式无效。');
  const values = body.events as RecordData[];
  if (values.some(value => !value || typeof value !== 'object' || !publicEvents.has(String(value.type)) || !/^[0-9a-f-]{36}$/i.test(String(value.id)))) throw new HttpError(400, 'invalid_event', '事件类型或编号无效。');
  await rateLimit(request, env, 'events', 180, 60);
  const session = await ensureVisit(request, env, body);
  if (!session.visit.is_bot) await env.DB.batch(values.map(value => eventStatement(env, session.visit, value, Date.now())));
  return { ...session, accepted: session.visit.is_bot ? 0 : values.length };
}
