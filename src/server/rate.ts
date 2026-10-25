import type { BackendEnv } from './types';
import { hmac } from './crypto';
import { HttpError } from './http';
export function requestIp(request: Request) { return request.headers.get('CF-Connecting-IP') || 'unavailable'; }
export async function rateLimit(request: Request, env: BackendEnv, purpose: string, limit: number, seconds: number, identity?: string) {
  const now = Date.now();
  const window = Math.floor(now / (seconds * 1000));
  const key = await hmac(env, `rate:${purpose}:${identity || requestIp(request)}:${window}`);
  const expiry = (window + 1) * seconds * 1000;
  const result = await env.DB.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, expiry).first<{ count: number }>();
  if (!result || result.count > limit) throw new HttpError(429, 'rate_limited', '操作过于频繁，请稍后重试。', Math.max(1, Math.ceil((expiry - now) / 1000)));
}
