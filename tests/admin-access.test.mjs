import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { assertAdminProtection } from '../scripts/admin-protection.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = join(root, '.qa', `access-auth-test-${randomUUID()}`);
await mkdir(temporary, { recursive: true });
// Execute the actual TypeScript authentication code, using only an ephemeral
// local signing key. No Cloudflare identity, database or customer record is used.
for (const name of ['auth', 'crypto', 'http', 'rate']) {
  const source = await readFile(join(root, 'src', 'server', `${name}.ts`), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/from (['"])(\.\/[^'"]+)\1/g, (_, quote, path) => `from ${quote}${path}.mjs${quote}`);
  await writeFile(join(temporary, `${name}.mjs`), output);
}
const { identity, login, assertCsrf } = await import(pathToFileURL(join(temporary, 'auth.mjs')).href);
const signing = await generateKeyPair('RS256');
const publicKey = { ...await exportJWK(signing.publicKey), kid: 'local-only', alg: 'RS256', use: 'sig' };
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  assert.equal(String(url), 'https://access-test.cloudflareaccess.com/cdn-cgi/access/certs');
  return Response.json({ keys: [publicKey] });
};
const config = {
  ADMIN_AUTH_MODE: 'access', ACCESS_TEAM_DOMAIN: 'access-test.cloudflareaccess.com',
  ACCESS_AUD: 'local-test-audience', ACCESS_ALLOWED_EMAILS: 'operator-1@example.invalid,operator-2@example.invalid',
  APP_SECRET: 'local-test-secret-that-is-not-a-live-credential',
  DB: { prepare() { throw new Error('Access identity must not read password sessions'); } },
};
const token = (email, options = {}) => new SignJWT({ email })
  .setProtectedHeader({ alg: 'RS256', kid: 'local-only' }).setIssuedAt()
  .setIssuer(options.issuer || 'https://access-test.cloudflareaccess.com')
  .setAudience(options.audience || config.ACCESS_AUD).setExpirationTime(options.expires || '5m')
  .sign(options.key || signing.privateKey);
const request = (value, cookie = false) => new Request('https://www.hanxingcapacitor.com/admin/', {
  headers: value ? (cookie ? { Cookie: `CF_Authorization=${value}` } : { 'Cf-Access-Jwt-Assertion': value }) : {},
});
const checks = [];
after(async () => {
  globalThis.fetch = originalFetch;
  await mkdir(join(root, 'docs', 'access-login-20261106'), { recursive: true });
  await writeFile(join(root, 'docs', 'access-login-20261106', 'auth-validation.json'), JSON.stringify({
    checkedAt: new Date().toISOString(), method: 'Actual source with ephemeral local RS256 JWTs and local JWKS response',
    remoteWrites: false, liveAccountLoginTest: false, passed: checks.length === 7, checks,
  }, null, 2) + '\n');
  const absolute = resolve(temporary);
  assert.ok(absolute.startsWith(resolve(root) + sep) && absolute.includes(`${sep}.qa${sep}access-auth-test-`));
  await rm(absolute, { recursive: true, force: true });
});
const verify = (name, callback) => test(name, async () => { await callback(); checks.push({ name, passed: true }); });

verify('两个测试白名单邮箱均通过签名验证，邮箱大小写不影响授权', async () => {
  for (const email of ['operator-1@example.invalid', 'operator-2@example.invalid']) {
    const user = await identity(request(await token(email)), config);
    assert.equal(user.email, email.toLowerCase()); assert.equal(user.mode, 'access');
    assert.match(user.csrf, /^[a-f0-9]{64}$/);
  }
});
verify('相同组织中未列入白名单的邮箱仍被拒绝', async () => {
  assert.equal(await identity(request(await token('unapproved@example.invalid')), config), null);
});
verify('错误应用、错误签发者、过期和无效签名均被拒绝', async () => {
  const otherKey = await generateKeyPair('RS256');
  for (const options of [{ audience: 'different-app' }, { issuer: 'https://another-team.cloudflareaccess.com' }, { expires: 946684800 }, { key: otherKey.privateKey }]) {
    assert.equal(await identity(request(await token('operator-1@example.invalid', options)), config), null);
  }
});
verify('缺少凭证、伪造凭证、旧密码 cookie 和缺少 Access 配置均被拒绝', async () => {
  assert.equal(await identity(request(), config), null);
  assert.equal(await identity(request('forged-token'), config), null);
  assert.equal(await identity(new Request('https://www.hanxingcapacitor.com/admin/', { headers: { Cookie: 'hx_admin=' + 'a'.repeat(64) } }), config), null);
  assert.equal(await identity(request(await token('operator-1@example.invalid')), { ...config, ACCESS_AUD: undefined }), null);
});
verify('Cookie 凭证可验证，但无效请求头不能借有效 Cookie 绕过', async () => {
  const value = await token('operator-1@example.invalid');
  assert.equal((await identity(request(value, true), config)).mode, 'access');
  const conflict = new Request('https://www.hanxingcapacitor.com/admin/', { headers: { Cookie: `CF_Authorization=${value}`, 'Cf-Access-Jwt-Assertion': 'forged-token' } });
  assert.equal(await identity(conflict, config), null);
});
verify('Access 模式关闭旧密码登录，管理写操作继续要求 CSRF', async () => {
  await assert.rejects(login(request(), config, 'admin@hanxing.local', 'unused'), { status: 503 });
  const user = await identity(request(await token('operator-1@example.invalid')), config);
  assert.throws(() => assertCsrf(request(), user), { status: 403 });
  assert.doesNotThrow(() => assertCsrf(new Request('https://www.hanxingcapacitor.com/api/admin/logout/', { headers: { 'X-CSRF-Token': user.csrf } }), user));
});
verify('发布检查拒绝无保护响应、其他 Access 应用及错误回跳地址', () => {
  const target = 'https://www.hanxingcapacitor.com/api/admin/inquiries/';
  const valid = new URL('https://access-test.cloudflareaccess.com/cdn-cgi/access/login/www.hanxingcapacitor.com');
  valid.searchParams.set('kid', config.ACCESS_AUD); valid.searchParams.set('redirect_url', '/api/admin/inquiries/');
  assert.doesNotThrow(() => assertAdminProtection(new Response(null, { status: 302, headers: { location: valid.href } }), target, config));
  for (const change of [url => { url.hostname = 'other.cloudflareaccess.com'; }, url => { url.searchParams.set('kid', 'different-app'); }, url => { url.searchParams.set('redirect_url', '/'); }]) {
    const invalid = new URL(valid); change(invalid);
    assert.throws(() => assertAdminProtection(new Response(null, { status: 302, headers: { location: invalid.href } }), target, config));
  }
  assert.throws(() => assertAdminProtection(new Response('{}', { status: 200 }), target, config));
});
