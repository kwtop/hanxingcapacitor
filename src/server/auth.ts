import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { AdminIdentity, BackendEnv } from './types';
import { cookie, cookies, HttpError } from './http';
import { equal, hmac, randomToken, sha256, verifyPassword } from './crypto';
import { rateLimit } from './rate';

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function identity(request: Request, env: BackendEnv): Promise<AdminIdentity | null> {
  if (env.ADMIN_AUTH_MODE === 'access') {
    const team = (env.ACCESS_TEAM_DOMAIN || '').replace(/^https:\/\//, '').replace(/\/$/, '');
    if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team) || !env.ACCESS_AUD || !env.ACCESS_ALLOWED_EMAILS) return null;
    const token = request.headers.get('Cf-Access-Jwt-Assertion') || cookies(request).CF_Authorization;
    if (!token) return null;
    try {
      if (!keySets.has(team)) keySets.set(team, createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`), { timeoutDuration: 5000 }));
      const { payload } = await jwtVerify(token, keySets.get(team)!, { issuer: `https://${team}`, audience: env.ACCESS_AUD, algorithms: ['RS256'] });
      const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
      if (!env.ACCESS_ALLOWED_EMAILS.toLowerCase().split(',').map(v => v.trim()).includes(email)) return null;
      return { email, mode: 'access', csrf: await hmac(env, `csrf:${token}`) };
    } catch { return null; }
  }
  if (env.ADMIN_AUTH_MODE !== 'password') return null;
  const token = cookies(request).hx_admin;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = await env.DB.prepare('SELECT email,csrf FROM admin_sessions WHERE token_hash=? AND expires_at>?').bind(await sha256(token), Date.now()).first<{ email: string; csrf: string }>();
  return row ? { ...row, mode: 'password' } : null;
}
export async function requireAdmin(request: Request, env: BackendEnv): Promise<AdminIdentity> {
  const user = await identity(request, env);
  if (!user) throw new HttpError(401, 'unauthorized', '请先登录后台。');
  return user;
}
export function assertCsrf(request: Request, user: AdminIdentity) {
  if (!equal(request.headers.get('X-CSRF-Token') || '', user.csrf)) throw new HttpError(403, 'csrf_rejected', '登录状态校验失败，请刷新后重试。');
}
export async function login(request: Request, env: BackendEnv, email: string, password: string) {
  if (env.ADMIN_AUTH_MODE !== 'password' || !env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH) throw new HttpError(503, 'auth_not_configured', '管理员登录尚未配置。');
  await rateLimit(request, env, 'login', 8, 900);
  const passwordMatches = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
  if (!equal(email.toLowerCase(), env.ADMIN_EMAIL.toLowerCase()) || !passwordMatches) throw new HttpError(401, 'invalid_credentials', '账号或密码不正确。');
  const token = randomToken(), csrf = randomToken(), now = Date.now();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash IN (SELECT token_hash FROM admin_sessions WHERE expires_at<? LIMIT 100)').bind(now),
    env.DB.prepare('INSERT INTO admin_sessions(token_hash,email,csrf,created_at,expires_at) VALUES(?,?,?,?,?)').bind(await sha256(token), env.ADMIN_EMAIL, csrf, now, now + 8 * 3600000),
  ]);
  return { cookie: cookie(request, 'hx_admin', token, 8 * 3600).replace('SameSite=Lax', 'SameSite=Strict'), email: env.ADMIN_EMAIL, csrf };
}
export async function logout(request: Request, env: BackendEnv) {
  const token = cookies(request).hx_admin;
  if (token) await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await sha256(token)).run();
  return cookie(request, 'hx_admin', '', 0).replace('SameSite=Lax', 'SameSite=Strict');
}
