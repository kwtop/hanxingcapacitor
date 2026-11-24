import {test} from 'node:test';
import assert from 'node:assert/strict';
import {browserLanguage,visitorContext} from '../src/server/visitorContext.ts';

test('浏览器语言按 Accept-Language 优先级取值，保留地区并规范化',()=>{
  assert.equal(browserLanguage('es-mx,es;q=0.9,en;q=0.8'),'es-MX');
  assert.equal(browserLanguage('en;q=0.2,zh-hans-cn;q=0.9'),'zh-Hans-CN');
  assert.equal(browserLanguage('de;q=0,pt-br;q=0.7'),'pt-BR');
  assert.equal(browserLanguage('zh-cn;q=0.8,en;q=0.8'),'zh-CN');
  for(const value of [null,'','*','en;q=3','es;q=0','<script>','zh_CN']) assert.equal(browserLanguage(value),'unknown');
});
test('仅使用 Cloudflare 地理信息，本地或缺失数据保持未知',()=>{
  const request=new Request('https://www.hanxingcapacitor.com/api/events',{headers:{'Accept-Language':'es-MX,es;q=0.9','CF-IPCountry':'US','X-City':'Fake city'}});
  assert.deepEqual(visitorContext(request,false),{country:'unknown',city:'unknown',browser_language:'es-MX'});
  Object.defineProperty(request,'cf',{value:{country:'BR',city:'São Paulo'}});
  assert.deepEqual(visitorContext(request,false),{country:'BR',city:'São Paulo',browser_language:'es-MX'});
  assert.deepEqual(visitorContext(request,true),{country:'unknown',city:'unknown',browser_language:'es-MX'});
});
