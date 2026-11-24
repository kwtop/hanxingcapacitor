import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import net from 'node:net';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),run=randomUUID();
const work=join(root,'.qa','admin-workflow-'+run),persist=join(root,'.wrangler','admin-workflow-'+run);
const evidence=join(root,'.qa','admin-usability-20261116');
const runtime=process.env.HANXING_PLAYWRIGHT_MODULE || join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=createRequire(runtime)('playwright');
const agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36';
const pause=ms=>new Promise(done=>setTimeout(done,ms));
const cli=args=>{
  const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:60000});
  assert.equal(result.status,0,(result.stderr||result.stdout).slice(-2000));return result.stdout;
};
const port=await new Promise((done,reject)=>{const server=net.createServer();server.once('error',reject);server.listen(0,'127.0.0.1',()=>{const value=server.address().port;server.close(()=>done(value));});});
const origin='http://127.0.0.1:'+port,findings=[],errors=[],requests=[],screens=[];
let worker,browser,logs='';
try {
  await mkdir(work,{recursive:true});await mkdir(evidence,{recursive:true});
  cli(['d1','migrations','apply','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist]);
  const now=Date.now(),today=new Date(now+8*3600000).toISOString().slice(0,10),start=Date.parse(today+'T00:00:00+08:00');
  const visitor=randomUUID(),visit=randomUUID();
  const inquiries=Array.from({length:28},(_,index)=>({id:randomUUID(),reference:'HX-UI-'+String(index).padStart(2,'0'),created:start-index*7*86400000+1000}));
  const eventIds=[randomUUID(),randomUUID(),randomUUID()];
  const sql=`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${visitor}',${start-86400000},${now});
INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,city,browser_language,device,language,is_internal) VALUES('${visit}','${visitor}',${start-86400000},${now},'/resources/articles/','workflow_qa','referral','HK','Hong Kong','es-MX','desktop','es',1);
${inquiries.map((row,index)=>`INSERT INTO inquiries(id,reference,created_at,updated_at,name,company,email,phone,country,products,message,submission_page,source_page,language,source,channel,is_internal,status,idempotency_hash,payload_hash) VALUES('${row.id}','${row.reference}',${row.created},${row.created},'Purchase Buyer ${String(index).padStart(2,'0')}','Example Equipment','buyer-${index}@example.invalid','+1 202 555 0100','Brazil','["${index%2?'CBB61':'CBB60'}"]','Please quote 1000 capacitors with matched dimensions and wire lengths.','/contact/','/products/','en','inbox_qa','referral',${index%2},'pending','${randomUUID()}','${randomUUID()}');`).join('\n')}
${eventIds.map((id,index)=>`INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,position,source,channel,country,device,language,is_internal) VALUES('${id}',${now-10000+index},${now},'${visitor}','${visit}','${index===0?'page_view':'whatsapp_click'}','/resources/articles/','${index===2?'navigation_whatsapp_1':'footer_whatsapp_1'}','workflow_qa','referral','HK','desktop','es',${index%2});`).join('\n')}
INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,source,channel,country,device,language,is_internal) VALUES('${randomUUID()}',${start-10000},${start-10000},'${visitor}','${visit}','page_view','/resources/articles/','workflow_qa','referral','HK','desktop','es',1);`;
  const fixture=join(work,'fixture.sql');await writeFile(fixture,sql);cli(['d1','execute','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist,'--file',fixture]);
  worker=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','wrangler.backend.jsonc','--local','--ip','127.0.0.1','--port',String(port),'--inspector-port','0','--persist-to',persist],{cwd:root,stdio:['ignore','pipe','pipe'],windowsHide:true});
  for(const stream of [worker.stdout,worker.stderr])stream.on('data',chunk=>logs=(logs+chunk).slice(-6000));
  let ready=false;
  for(let attempt=0;attempt<100;attempt++){
    if(worker.exitCode!==null)throw new Error('Isolated worker stopped: '+logs.slice(-1200));
    try{ready=(await fetch(origin+'/api/health/')).ok;if(ready)break;}catch{}
    await pause(300);
  }
  assert.ok(ready,'Isolated worker not ready');
  browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},userAgent:agent,acceptDownloads:true});
  for(const path of ['/api/admin/inquiries/','/api/admin/inquiries/export/'])assert.equal((await context.request.get(origin+path)).status(),401);
  findings.push('Unauthenticated inquiry and CSV requests denied');
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{const url=new URL(request.url());if(url.pathname.startsWith('/api/admin/'))requests.push({path:url.pathname,query:url.search});});
  const access=await readFile(join(root,'.admin-local','access.txt'),'utf8');
  await page.goto(origin+'/admin/',{waitUntil:'networkidle'});
  await page.locator('input[name="email"]').fill(access.match(/邮箱：([^\r\n]+)/)[1]);
  await page.locator('input[name="password"]').fill(access.match(/密码：([^\r\n]+)/)[1]);
  await page.locator('#login-form button').click();
  await page.waitForSelector('body[data-authenticated="true"]');
  const settled=async()=>{await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]')&&!document.getElementById('load-feedback').textContent);assert.equal(await page.locator('#error').isVisible(),false);};
  await page.waitForSelector('.metric');await settled();
  await page.locator('#date-preset').selectOption('yesterday');await settled();
  await page.locator('#filters-toggle').click();await page.locator('select[name="source"]').selectOption('workflow_qa');
  await page.locator('#advanced-filters button[type="submit"]').click();await settled();
  await page.locator('[data-view="inquiries"]').click();await settled();
  assert.equal(await page.locator('.inquiry-row').count(),25);assert.match(await page.locator('#inquiry-count').innerText(),/共 28 条/);
  assert.equal(await page.locator('#date-range').isVisible(),false);assert.equal(await page.locator('#date-preset').isVisible(),false);
  assert.ok(!new URL(page.url()).searchParams.has('from'));assert.equal(await page.locator('select[name="source"]').inputValue(),'');
  const listRequest=requests.findLast(row=>row.path==='/api/admin/inquiries/');assert.ok(!new URLSearchParams(listRequest.query).has('from'));assert.ok(!new URLSearchParams(listRequest.query).has('include_internal'));
  findings.push('Inquiry view includes 28 records across 190 days and ignores analytics dates and filters');
  await page.locator('.inquiry-row').first().click();await page.waitForSelector('#detail-status');await settled();
  await page.locator('#detail-status').selectOption('following');await page.waitForFunction(()=>document.getElementById('detail-feedback')?.textContent==='已保存。');await settled();
  await page.locator('#note-text').fill('已联系客户，等待装配尺寸。');await page.locator('#note-form button').click();
  await page.waitForFunction(()=>document.getElementById('detail-feedback')?.textContent==='备注已保存。');
  assert.match(await page.locator('#notes').innerText(),/已联系客户/);
  const saved=await (await context.request.get(origin+'/api/admin/inquiries/'+inquiries[0].id+'/')).json();assert.equal(saved.status,'following');assert.equal(saved.notes.length,1);assert.ok(saved.read_at);
  findings.push('Opening an inquiry marks it read; status and follow-up note persist in isolated D1');
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;
  const csv=await readFile(await download.path(),'utf8');assert.equal(csv.trim().split('\r\n').length,29);assert.match(csv,/HX-UI-27/);
  findings.push('Export button downloads all 28 inquiries, including the oldest');
  await page.locator('#inquiries-pagination').getByRole('button',{name:'下一页',exact:true}).click();await settled();assert.equal(await page.locator('.inquiry-row').count(),3);
  await page.locator('#inquiry-search').fill('Purchase Buyer 27');await page.locator('#search-inquiries').click();await settled();assert.equal(await page.locator('.inquiry-row').count(),1);
  await page.locator('#inquiry-status').selectOption('completed');await settled();assert.equal(await page.locator('#inquiry-empty').isVisible(),true);
  await page.locator('#clear-inquiry-filters').click();await settled();assert.equal(await page.locator('.inquiry-row').count(),25);
  await page.locator('[data-view="overview"]').click();await settled();assert.equal(await page.locator('#date-preset').inputValue(),'yesterday');assert.equal(await page.locator('select[name="source"]').inputValue(),'workflow_qa');
  findings.push('Pagination, oldest-record search, status empty state and clear filters work; analytics selection is preserved');
  await page.locator('#date-preset').selectOption('today');await settled();
  await page.locator('.metric-drill').first().click();await page.waitForSelector('.attribution-record');
  assert.equal(await page.locator('.attribution-record').count(),2);assert.equal(await page.locator('.attribution-record code').count(),0);
  assert.doesNotMatch(await page.locator('#records-dialog').innerText(),/内部测试|footer_whatsapp_1|navigation_whatsapp_1/);
  assert.match(await page.locator('#records-dialog').innerText(),/页脚|顶部导航/);
  await page.locator('#record-position').selectOption('footer_whatsapp_1');await page.locator('#record-filters button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('.attribution-record').length===1);assert.match(await page.locator('#records-summary').innerText(),/1 次点击/);
  await page.screenshot({path:join(evidence,'contact-records-1440.png'),mask:[page.locator('.account-email')]});
  await page.locator('.attribution-record [data-visitor]').click();await page.waitForSelector('#timeline li');
  assert.equal(await page.locator('.focused-event').isVisible(),true);assert.doesNotMatch(await page.locator('#detail-dialog').innerText(),/内部测试/);
  await page.screenshot({path:join(evidence,'visitor-journey-1440.png'),mask:[page.locator('.account-email')]});
  await page.locator('#close-detail').click();
  findings.push('Contact records and focused visitor journey include historical flagged events without labels or raw position codes');
  await page.locator('[data-view="inquiries"]').click();await settled();
  for(const [width,height] of [[1440,1000],[1024,768],[768,1024],[390,844]]){
    await page.setViewportSize({width,height});await settled();
    // On narrow screens the selected inquiry uses the same accessible back action.
    const back=page.locator('.detail-back');if(await back.isVisible())await back.click();
    const geometry=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
    assert.ok(geometry.content<=width+1,JSON.stringify({width,...geometry}));
    const file='inquiries-'+width+'.png';await page.screenshot({path:join(evidence,file),mask:[page.locator('.account-email')]});screens.push({width,height,file,...geometry});
    if(width===390){
      await page.locator('.inquiry-row').first().click();await page.waitForSelector('#detail-status');assert.equal(await page.locator('.inbox-detail').isVisible(),true);
      await page.screenshot({path:join(evidence,'inquiry-detail-390.png'),mask:[page.locator('.account-email')]});
      await page.locator('.detail-back').click();assert.equal(await page.locator('.inbox-list').isVisible(),true);
    }
  }
  findings.push('1440, 1024, 768 and 390 pixel layouts have no horizontal page overflow; mobile detail/back works');
  assert.deepEqual(errors,[]);
  await context.close();
  await writeFile(join(evidence,'browser-validation.json'),JSON.stringify({checkedAt:new Date().toISOString(),passed:true,database:'isolated local D1',remoteWrites:false,notificationsSent:false,findings,screens,errors},null,2)+'\n');
  console.log(JSON.stringify({passed:true,checks:findings.length,screenshots:screens.length+3,evidence,remoteWrites:false}));
} catch(error) {
  await mkdir(evidence,{recursive:true});
  await writeFile(join(evidence,'browser-failure.json'),JSON.stringify({message:error.message,stack:error.stack,errors,findings},null,2));
  throw error;
} finally {
  await browser?.close();
  if(worker&&worker.exitCode===null){if(process.platform==='win32')spawnSync('taskkill',['/PID',String(worker.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});else worker.kill('SIGTERM');await pause(500);}
  for(const target of [work,persist]){
    const absolute=resolve(target);assert.ok(absolute.startsWith(root+sep)&&(absolute.startsWith(join(root,'.qa','admin-workflow-'))||absolute.startsWith(join(root,'.wrangler','admin-workflow-'))));
    await rm(absolute,{recursive:true,force:true});
  }
}
