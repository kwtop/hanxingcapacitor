import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function readAdminConfig() {
  const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
  return config.vars;
}

// An Access login redirect protects production at the edge; the origin must
// still reject unsigned requests on Pages hostnames that are outside Access.
export function assertAdminProtection(response, requestUrl, config) {
  if (config.ADMIN_AUTH_MODE !== 'access') {
    assert.equal(response.status, 401, `Expected protected admin API: ${requestUrl}`);
    return;
  }
  assert.equal(response.status, 302, `Expected Cloudflare Access challenge: ${requestUrl}`);
  const destination = new URL(response.headers.get('location') || '', requestUrl);
  const target = new URL(requestUrl);
  assert.equal(destination.origin, `https://${config.ACCESS_TEAM_DOMAIN}`);
  assert.equal(destination.pathname, `/cdn-cgi/access/login/${target.hostname}`);
  assert.equal(destination.searchParams.get('kid'), config.ACCESS_AUD, 'Access challenge must use this application');
  assert.equal(new URL(destination.searchParams.get('redirect_url') || '', target).href, target.href);
}
