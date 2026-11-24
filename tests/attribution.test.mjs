import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {sourceName,positionName} from '../public/admin-assets/attribution-labels.js';
const compiled=await build({entryPoints:[fileURLToPath(new URL('../src/server/attribution.ts',import.meta.url))],bundle:true,write:false,platform:'node',format:'esm'});
const {sourceInfo}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));

const request=new Request('https://www.hanxingcapacitor.com/api/events/');
test('识别搜索引擎、保留引荐路径，丢弃查询词、片段及凭据',()=>{
  for(const host of ['www.google.com','www.google.co.uk','cn.bing.com','duckduckgo.com','search.yahoo.co.jp','www.baidu.com','yandex.com.tr','search.brave.com']){
    const source=sourceInfo(request,{referrer:`https://${host}/search?q=PRIVATE-QUERY#token`});
    assert.equal(source.channel,'organic_search',host);assert.equal(source.source,host);assert.equal(source.referrer_url,`https://${host}/search`);
    assert.doesNotMatch(JSON.stringify(source),/PRIVATE-QUERY|token/);
  }
  for(const referrer of ['javascript:alert(1)','data:text/plain,google.com','https://user:secret@google.com/search'])assert.equal(sourceInfo(request,{referrer}).channel,'direct_or_unknown');
  for(const host of ['google.com.attacker.invalid','notgoogle.com','bing.com.attacker.invalid'])assert.equal(sourceInfo(request,{referrer:`https://${host}/`}).channel,'referral');
});
test('UTM 区分付费与自然来源，首访来源不会把站内跳转算成引荐',()=>{
  const source=sourceInfo(request,{referrer:'https://www.google.com/search?private=1',utmSource:'Google',utmMedium:'cpc',utmCampaign:'CBB65 Export 2026'});
  assert.equal(source.channel,'paid_search');assert.equal(source.source,'google');assert.equal(source.utm_medium,'cpc');assert.equal(source.utm_campaign,'CBB65 Export 2026');
  assert.equal(sourceInfo(request,{utmSource:'bing',utmMedium:'organic'}).channel,'organic_search');
  for(const referrer of ['https://hanxingcapacitor.com/contact/','https://www.hanxingcapacitor.com/es/']){
    const self=sourceInfo(request,{referrer});assert.equal(self.channel,'direct_or_unknown');assert.equal(self.referrer_url,'');assert.equal(self.referrer_host,'');
  }
  const invalid=sourceInfo(request,{utmSource:'bad<script>',utmMedium:'email',utmCampaign:'secret@example.com'});
  assert.equal(invalid.source,'direct_or_unknown');assert.equal(invalid.utm_campaign,'');
});
test('来源与位置名称保留可识别的限定条件',()=>{
  assert.equal(sourceName('www.google.co.uk'),'Google');assert.equal(sourceName('google.com.attacker.invalid'),'google.com.attacker.invalid');
  assert.equal(sourceName('direct_or_unknown'),'直接 / 未识别');assert.equal(sourceName('partner.example'),'partner.example');
  assert.equal(positionName('contact_wechat_qr'),'联系页 · 微信二维码');
  assert.equal(positionName('footer_email_2'),'页脚 · 邮箱入口 2');assert.equal(positionName('navigation_whatsapp_1'),'顶部导航 · WhatsApp入口 1');
  assert.equal(positionName('historical_custom'),'historical_custom');
});
