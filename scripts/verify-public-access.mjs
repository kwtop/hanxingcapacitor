import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {assertAdminProtection, readAdminConfig} from './admin-protection.mjs';

const base='https://www.hanxingcapacitor.com';
const docs=process.argv[2]||'docs/spanish-localization-20261106';
const probes=[];
const adminConfig=await readAdminConfig();
async function get(url, options={}) {
  const r=await fetch(url,{headers:{'Accept-Encoding':'identity',...options.headers},method:options.method||'GET',redirect:'manual',signal:AbortSignal.timeout(20000)});
  const text=await r.text();
  let location=r.headers.get('location');
  if(location){
    const destination=new URL(location,url);
    if(destination.hostname.endsWith('.cloudflareaccess.com')){destination.searchParams.delete('meta');location=destination.href;}
  }
  const row={url,method:options.method||'GET',status:r.status,location,xRobots:r.headers.get('x-robots-tag'),mitigated:r.headers.get('cf-mitigated')};
  probes.push(row);return {r,text,row};
}
for(const path of ['/','/es/'])for(const ua of ['Mozilla/5.0','Googlebot','bingbot','OAI-SearchBot','ChatGPT-User','GPTBot','ClaudeBot','PerplexityBot']){
  const {r,text,row}=await get(base+path,{headers:{'User-Agent':ua}});row.userAgent=ua;
  assert.equal(r.status,200,ua);assert.ok(!/noindex/i.test(r.headers.get('x-robots-tag')||''));assert.match(text,/index,follow/);assert.equal(r.headers.get('cf-mitigated'),null);
}
const robots=await get(base+'/robots.txt');assert.match(robots.text,/User-agent: \*\nAllow: \//);
const sitemap=await get(base+'/sitemap.xml');assert.equal((sitemap.text.match(/<loc>/g)||[]).length,80);assert.equal((sitemap.text.match(/<lastmod>/g)||[]).length,51);
const images=await get(base+'/sitemap-images.xml');assert.equal(images.r.status,200);assert.ok(!/\.(?:jpg|png|jpeg)</i.test(images.text));
const llms=await get(base+'/llms.txt');assert.match(llms.text,/Headquarters — Hangzhou/);assert.match(llms.text,/Manufacturing facility — Hebei/);
for(const [method,url] of [['GET','https://hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/?utm_source=audit&photo=P027'],['HEAD','https://hanxingcapacitor.com/about/?request=documents'],['GET','http://hanxingcapacitor.com/about/?utm_source=audit'],['GET','https://hanxingcapacitor.com/es/contact/?series=CD60&photo=P038']]){
  const {r}=await get(url,{method});const expected=new URL(url);expected.protocol='https:';expected.hostname='www.hanxingcapacitor.com';assert.equal(r.status,301);assert.equal(r.headers.get('location'),expected.href);
}
for(const host of ['https://hanxingcapacitor.com',base])for(const route of ['/admin','/admin/','/api/admin/me/','/api/admin/inquiries/','/api/admin/inquiries/export/']){
  const {r}=await get(host+route);
  assertAdminProtection(r,host+route,adminConfig);
}
const health=await get(base+'/api/health/');assert.equal(health.r.status,200);assert.equal(JSON.parse(health.text).ready,true);
// Cloudflare's authorization callback must stay on its original hostname.
// A missing-state probe is rejected with 400 by Access, never canonicalized.
for(const host of ['https://hanxingcapacitor.com',base]){
  const callback=await get(host+'/cdn-cgi/access/authorized?probe=access-setup');
  assert.equal(callback.r.status,400);assert.equal(callback.r.headers.get('location'),null);
  assert.equal((await get(host+'/cdn-cgi/trace')).r.status,200);
}
const deployment=JSON.parse(await fs.readFile(docs+'/deployment.json','utf8'));
for(const host of ['https://hanxing-capacitor-preview.pages.dev',deployment.deployment.url]){
  for(const path of ['/','/es/'])assert.match((await get(host+path)).r.headers.get('x-robots-tag'),/noindex/);
  for(const path of ['/api/admin/me/','/api/admin/inquiries/','/api/admin/inquiries/export/'])assert.equal((await get(host+path)).r.status,401);
}
const result={checkedAt:new Date().toISOString(),method:'Public GET/HEAD and User-Agent probes; not verified crawler IPs, indexing or AI citation evidence.',probes,errors:[]};
await fs.writeFile(docs+'/live-access-verification.json',JSON.stringify(result,null,2)+'\n');
await fs.copyFile('.qa/public-release-latest.json',docs+'/live-release-audit.json');
console.log(JSON.stringify({probes:probes.length,searchAndAiAgents:8,publicPages:80,wwwRedirects:4,privateChecks:16,adminAuthMode:adminConfig.ADMIN_AUTH_MODE,healthReady:true,previewNoindex:true,errors:[]}));
