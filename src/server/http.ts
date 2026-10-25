import type { BackendEnv, RecordData } from './types';

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfter?: number) { super(message); }
}
export const secureHeaders = {
  'Cache-Control': 'no-store, private',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'same-origin',
};
export function json(value: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(value), { status, headers: { ...secureHeaders, 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}
export function field(value: unknown, max = 200): string { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
export function pathOnly(value: unknown): string {
  const text = field(value, 500);
  if (!text.startsWith('/') || text.startsWith('//') || /[\\\r\n\u0000]/.test(text)) return '/';
  return text.split(/[?#]/)[0].slice(0, 240) || '/';
}
export function language(value: unknown): string {
  const text = field(value, 18).toLowerCase();
  return /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(text) ? text : 'unknown';
}
export function productCode(value: unknown): string {
  return ['CBB60', 'CBB61', 'CBB65', 'CD60'].includes(String(value)) ? String(value) : 'unknown';
}
export function localMode(request: Request, env: BackendEnv): boolean {
  return env.APP_ENV === 'local' && ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(request.url).hostname);
}
export function assertOrigin(request: Request, env: BackendEnv) {
  const origin = request.headers.get('Origin');
  const allowed = new Set([new URL(request.url).origin, ...(env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean)]);
  if (!origin || !allowed.has(origin)) throw new HttpError(403, 'origin_rejected', '请求来源不允许。');
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new HttpError(403, 'origin_rejected', '请求来源不允许。');
}
export async function readJson(request: Request, max = 24576): Promise<RecordData> {
  if (!request.headers.get('Content-Type')?.includes('application/json')) throw new HttpError(415, 'json_required', '请使用 JSON 请求。');
  if (Number(request.headers.get('Content-Length')) > max) throw new HttpError(413, 'too_large', '提交内容过大。');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'invalid_json', '请求内容无效。');
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.length;
      if (length > max) { await reader.cancel(); throw new HttpError(413, 'too_large', '提交内容过大。'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const result = JSON.parse(new TextDecoder().decode(bytes));
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('object required');
    return result;
  } catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400, 'invalid_json', '请求内容无效。'); }
}
export function cookies(request: Request): Record<string, string> {
  return Object.fromEntries((request.headers.get('Cookie') || '').split(';').flatMap(part => {
    const index = part.indexOf('='); return index < 0 ? [] : [[part.slice(0, index).trim(), part.slice(index + 1).trim()]];
  }));
}
export function cookie(request: Request, name: string, value: string, maxAge: number, httpOnly = true) {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${httpOnly ? '; HttpOnly' : ''}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}
