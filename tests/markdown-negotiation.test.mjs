import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prefersMarkdown,negotiatePublicMarkdown,varyAccept} from '../src/server/markdownNegotiation.ts';
import {publicPageMarkdown} from '../scripts/lib/agent-markdown.mjs';
import {publicMarkdownRoutes} from '../scripts/prepare-agent-markdown.mjs';
const origin='https://www.hanxingcapacitor.com';
const pages={'/resources/example/':{markdown:'# Capacitor selection\n\n35 µF ±5%, 450 VAC.\n',canonical:origin+'/resources/example/',language:'en'}};

test('明确偏好 Markdown 才协商，保留浏览器默认 HTML 与质量权重',()=>{
  for(const value of [null,'','*/*','text/html,application/xhtml+xml,*/*;q=0.8','text/markdown;q=0','text/markdown;q=0.2,text/html;q=0.9','text/markdown;q=invalid'])assert.equal(prefersMarkdown(value),false,value);
  for(const value of ['text/markdown','TEXT/MARKDOWN; charset=utf-8','text/markdown,text/html;q=0.9','text/html,text/markdown','text/markdown;q=0.5,text/html;q=0,*/*;q=1'])assert.equal(prefersMarkdown(value),true,value);
});
test('Markdown 的 GET 和 HEAD 使用正确类型、语言、缓存和 canonical',async()=>{
  for(const method of ['GET','HEAD']){
    const response=await negotiatePublicMarkdown(new Request(origin+'/resources/example/?utm_source=test',{method,headers:{Accept:'text/markdown'}}),pages,()=>{throw new Error('Markdown must not execute HTML or private handlers');});
    assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/^text\/markdown; charset=utf-8$/);assert.equal(response.headers.get('content-language'),'en');assert.equal(response.headers.get('vary'),'Accept');assert.equal(response.headers.get('cache-control'),'no-store');assert.match(response.headers.get('link'),/rel="canonical"/);assert.equal(response.headers.get('x-robots-tag'),null);assert.equal(await response.text(),method==='HEAD'?'':pages['/resources/example/'].markdown);
  }
});
test('HTML 内容与原有 Vary、cookie 和安全响应头完整保留',async()=>{
  const original='<html><body>Original browser page</body></html>',response=await negotiatePublicMarkdown(new Request(origin+'/resources/example/',{headers:{Accept:'text/html,text/markdown;q=0'}}),pages,async()=>new Response(original,{headers:{'Content-Type':'text/html','Vary':'Origin, Accept-Encoding','Set-Cookie':'fixture=1; Secure','X-Frame-Options':'DENY'}}));
  assert.equal(await response.text(),original);assert.equal(response.headers.get('vary'),'Origin, Accept-Encoding, Accept');assert.equal(response.headers.get('set-cookie'),'fixture=1; Secure');assert.equal(response.headers.get('x-frame-options'),'DENY');assert.match(response.headers.get('link'),/type="text\/markdown"/);
  const headers=new Headers({Vary:'*'});varyAccept(headers);assert.equal(headers.get('Vary'),'*');
});
test('后台、API、资源、缺失页、别名和非读取操作不转 Markdown',async()=>{
  for(const [path,status,method] of [['/admin/',401,'GET'],['/api/admin/inquiries/',401,'GET'],['/image.webp',200,'GET'],['/missing/',404,'GET'],['/resources/private/',404,'GET'],['/es/resources/private/',404,'GET'],['/request-a-quote/',301,'GET'],['/resources/example/',405,'POST']]){
    const response=await negotiatePublicMarkdown(new Request(origin+path,{method,headers:{Accept:'text/markdown'}}),pages,async()=>new Response('Original response',{status,headers:{'Content-Type':'application/json'}}));
    assert.equal(response.status,status);assert.equal(response.headers.get('content-type'),'application/json');assert.equal(response.headers.get('vary'),null);assert.equal(await response.text(),'Original response');
  }
});
test('文章集合增长时路由保持在 Pages 限制内，后台规则和独立页面仍保留',()=>{
  const paths=['/','/about/',...Array.from({length:80},(_,i)=>`/resources/guide-${i}/`),...Array.from({length:80},(_,i)=>`/es/resources/guide-${i}/`)];
  const routes=publicMarkdownRoutes(paths);
  assert.ok(routes.include.length<=100);
  assert.deepEqual(routes.include,['/api/*','/admin','/admin/*','/','/about/','/resources/*','/es/resources/*']);
  assert.deepEqual(routes.exclude,[]);
});
test('Pages 预览域名的 Markdown 继续 noindex',async()=>{
  const response=await negotiatePublicMarkdown(new Request('https://candidate.hanxing-capacitor-preview.pages.dev/resources/example/',{headers:{Accept:'text/markdown'}}),pages,()=>{throw new Error('Unexpected fallback');});assert.match(response.headers.get('x-robots-tag'),/noindex/);
});
test('正文转换保留参数、表格、来源说明与绝对链接，去掉界面及表单数据',()=>{
  const html=`<!doctype html><html lang="en"><head><title>Capacitor selection</title><meta name="description" content="Check the rating and installed fit."><link rel="canonical" href="${origin}/resources/example/"></head><body><nav>GLOBAL NAVIGATION</nav><main><h1><span>CBB60 motor</span><span>capacitor</span></h1><p>Select the nominal capacitance and AC voltage specified by the equipment manufacturer, then check the drawing and physical fit before placing an order.</p><table><thead><tr>\n<th>Field</th>\n<th>Value</th>\n</tr></thead><tbody><tr><td>Rating</td><td>35 µF ±5%<br>450 VAC</td></tr><tr><td>Options</td><td>A | B</td></tr></tbody></table><dl><dt>Terminal</dt><dd>Two wire leads.</dd></dl><figure><button><img src="/images/sample.webp" alt="CBB60 sample"></button><figcaption>AI-retouched sample photograph.</figcaption></figure><nav><a href="/resources/other/">Related technical guide</a></nav><form action="/api/inquiries/" id="inquiry"><input value="PRIVATE-FORM-VALUE"><button type="submit">Send inquiry</button></form><div hidden>HIDDEN INTERFACE</div><script>PRIVATE-SCRIPT</script></main><footer>GLOBAL FOOTER</footer></body></html>`;
  const {markdown,tables}=publicPageMarkdown(html,origin);assert.equal(tables,1);assert.match(markdown,/# CBB60 motor capacitor/);assert.match(markdown,/35 µF ±5%; 450 VAC/);assert.match(markdown,/A \\\| B/);assert.match(markdown,/\*\*Terminal:\*\*/);assert.ok(markdown.includes(origin+'/images/sample.webp'));assert.ok(markdown.includes(origin+'/resources/other/'));assert.ok(markdown.includes(origin+'/contact/#inquiry'));assert.match(markdown,/AI-retouched sample photograph/);assert.doesNotMatch(markdown,/GLOBAL NAVIGATION|GLOBAL FOOTER|PRIVATE-|HIDDEN INTERFACE|<table|<script|<form/);
  const card=html.replace('<dl><dt>Terminal</dt><dd>Two wire leads.</dd></dl>','<a href="/products/cbb60/"><h2>CBB60</h2><div class="su-series-values"><span>2–100 µF</span><span>110–450 VAC</span></div></a><dl><dt>Single run</dt><dd>2–100 µF<small>110–450 VAC</small></dd></dl><button><img src="/images/selector-thumb.webp" alt=""></button>');
  const cleaned=publicPageMarkdown(card,origin).markdown;assert.ok(cleaned.includes('## [CBB60]('+origin+'/products/cbb60/)'));assert.ok(cleaned.includes('**Single run:** 2–100 µF · 110–450 VAC'));assert.doesNotMatch(cleaned,/µF110|selector-thumb/);
});
