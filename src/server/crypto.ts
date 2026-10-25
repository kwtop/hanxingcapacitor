import type { BackendEnv } from './types';
import { HttpError } from './http';
const encoder = new TextEncoder();
export const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map(v => v.toString(16).padStart(2, '0')).join('');
export const randomToken = () => hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
export async function sha256(value: string) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
export function equal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0; for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
export async function hmac(env: BackendEnv, value: string): Promise<string> {
  if (!env.APP_SECRET || env.APP_SECRET.length < 32) throw new HttpError(503, 'configuration_missing', '服务尚未配置完成。');
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.APP_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}
export async function signId(env: BackendEnv, value: string): Promise<string> { return `${value}.${await hmac(env, value)}`; }
export async function verifyId(env: BackendEnv, value = ''): Promise<string | null> {
  const index = value.lastIndexOf('.'); if (index < 1) return null;
  const id = value.slice(0, index);
  return equal(await hmac(env, id), value.slice(index + 1)) ? id : null;
}
export async function verifyPassword(password: string, stored = ''): Promise<boolean> {
  const [algorithm, rounds, salt, expected] = stored.split('$');
  const iterations = Number(rounds);
  if (algorithm !== 'pbkdf2_sha256' || iterations < 100000 || iterations > 100000 || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{64}$/.test(expected || '')) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bytes = Uint8Array.from(salt.match(/../g)!, v => parseInt(v, 16));
  const result = hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations, salt: bytes }, key, 256));
  return equal(result, expected);
}
