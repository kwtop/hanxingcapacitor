import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,resolve,sep} from 'node:path';
import net from 'node:net';
import {randomUUID} from 'node:crypto';

const root=fileURLToPath(new URL('../',import.meta.url)),runId=randomUUID(),persist=join(root,'.wrangler',`backend-test-${runId}`),work=join(root,'.qa','backend-tests',runId),base='http://127.0.0.1:8797';
const human='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36';
const seedVisitor=randomUUID(),seedVisit=randomUUID();
let processHandle,output='',admin,customer,second,savedA,savedB,proofA,proofB,loginEmail,loginPassword;
const findings=[];
const pause=ms=>new Promise(resolvePause=>setTimeout(resolvePause,ms));
function cli(args){const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:60000});if(result.status!==0)throw new Error((result.stderr||result.stdout).slice(-3000));return result.stdout;}
function db(sql){return cli(['d1','execute','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist,'--command',sql,'--json']);}
class Client{
  constructor(userAgent=human){this.jar=new Map();this.ua=userAgent;this.csrf='';}
  async request(path,options={}){
    const headers=new Headers({'User-Agent':this.ua,...options.headers});
    if(this.jar.size)headers.set('Cookie',[...this.jar].map(([key,value])=>`${key}=${value}`).join('; '));
    if(options.body!==undefined){headers.set('Content-Type','application/json');headers.set('Origin',options.origin||base);if(this.csrf&&!options.noCsrf)headers.set('X-CSRF-Token',this.csrf);}
    const response=await fetch(base+path,{method:options.method||'GET',headers,body:options.body===undefined?undefined:JSON.stringify(options.body),signal:AbortSignal.timeout(20000)});
    for(const value of response.headers.getSetCookie()){const [pair]=value.split(';'),index=pair.indexOf('=');this.jar.set(pair.slice(0,index),pair.slice(index+1));}
    const text=await response.text();let data;try{data=JSON.parse(text);}catch{}
    return {status:response.status,data,text,headers:response.headers};
  }
}
async function start(){
  output='';processHandle=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','wrangler.backend.jsonc','--local','--ip','127.0.0.1','--port','8797','--inspector-port','0','--persist-to',persist],{cwd:root,stdio:['ignore','pipe','pipe'],windowsHide:true});
  for(const stream of [processHandle.stdout,processHandle.stderr])stream.on('data',chunk=>{output=(output+chunk.toString()).slice(-10000);});
  for(let attempt=0;attempt<100;attempt++){
    if(processHandle.exitCode!==null)throw new Error('Worker stopped: '+output.slice(-2500));
    try{const response=await fetch(base+'/api/health');if(response.ok&&(await response.json()).app==='hanxing-admin')return;}catch{}
    await pause(300);
  }
  throw new Error('Worker not ready: '+output.slice(-2500));
}
async function stop(){
  if(!processHandle||processHandle.exitCode!==null)return;
  if(process.platform==='win32')spawnSync('taskkill',['/PID',String(processHandle.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});else processHandle.kill('SIGTERM');
  await pause(500);
}
const event=(type,product='CBB60',page='/products/cbb60-motor-run-capacitor/')=>({id:randomUUID(),type,page,product,language:'en',position:'integration_test'});
const inquiry=(suffix='A')=>({name:suffix==='A'?'=LOCAL-TEST-CLIENT':'Local Test B',company:'QA Company',email:`qa-${suffix.toLowerCase()}@example.invalid`,phone:'+86 10000000000',country:'China',products:[suffix==='A'?'CBB60':'CBB61'],message:`Local integration test ${suffix}: quote 1000 capacitors with a matching drawing.`,page:'/contact/',sourcePage:'/products/cbb60-motor-run-capacitor/',language:suffix==='A'?'en':'es',idempotencyKey:randomUUID(),website:''});
before(async()=>{
  await new Promise((resolvePort,reject)=>{const probe=net.createServer();probe.once('error',reject);probe.listen(8797,'127.0.0.1',()=>probe.close(resolvePort));});
  await mkdir(work,{recursive:true});
  const access=await readFile(join(root,'.admin-local','access.txt'),'utf8');loginEmail=access.match(/邮箱：([^\r\n]+)/)[1];loginPassword=access.match(/密码：([^\r\n]+)/)[1];
  cli(['d1','migrations','apply','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist]);
  const previous=Date.now()-9*86400000;
  const seed=`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${seedVisitor}',${previous},${previous});
INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,device,language,is_internal) VALUES('${seedVisit}','${seedVisitor}',${previous},${previous},'/','fixture','organic_search','unknown','desktop','en',1);
${['page_view','page_view','email_click','form_start'].map((type,index)=>`INSERT INTO events(id,occurred_at,visitor_id,visit_id,type,page,product,language,position,source,channel,country,device,is_internal) VALUES('${randomUUID()}',${previous+index},'${seedVisitor}','${seedVisit}','${type}','/','CBB60','en','fixture','fixture','organic_search','unknown','desktop',1);`).join('\n')}`;
  const fixture=join(work,'fixture.sql');await writeFile(fixture,seed);cli(['d1','execute','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist,'--file',fixture]);
  await start();admin=new Client();customer=new Client();second=new Client();
  const logged=await admin.request('/api/admin/login',{method:'POST',body:{email:loginEmail,password:loginPassword}});assert.equal(logged.status,200,JSON.stringify(logged.data));admin.csrf=logged.data.csrf;
  proofA=(await customer.request('/api/public-config')).data.formToken;proofB=(await second.request('/api/public-config')).data.formToken;
});
after(async()=>{
  await stop();
  await mkdir(join(root,'.qa','backend-tests'),{recursive:true});await writeFile(join(root,'.qa','backend-tests','latest.json'),JSON.stringify({checkedAt:new Date().toISOString(),database:'isolated local Cloudflare D1',remoteWrites:false,checks:findings},null,2));
  for(const target of [persist,work]){const absolute=resolve(target);if(!absolute.startsWith(resolve(root)+sep)||(!absolute.includes(`${sep}.wrangler${sep}backend-test-`)&&!absolute.includes(`${sep}.qa${sep}backend-tests${sep}`)))throw new Error('Unsafe cleanup target');await rm(absolute,{recursive:true,force:true});}
});
async function check(name,fn){return test(name,async()=>{await fn();findings.push({name,passed:true});});}

check('未登录不能读取、查询轨迹或导出客户信息',async()=>{
  const anonymous=new Client();for(const path of ['/api/admin/me','/api/admin/inquiries','/api/admin/inquiries/export','/api/admin/visitors','/api/admin/overview'])assert.equal((await anonymous.request(path)).status,401,path);
  const page=await anonymous.request('/admin/');assert.match(page.text,/登录后台/);assert.doesNotMatch(page.text,/QA Company/);assert.match(page.headers.get('cache-control'),/no-store/);
  assert.equal((await anonymous.request('/api/admin/inquiries',{headers:{'Cf-Access-Jwt-Assertion':'forged-token'}})).status,401);
});
check('跨站提交与缺少 CSRF 的管理操作被拒绝',async()=>{
  assert.equal((await customer.request('/api/events',{method:'POST',origin:'https://attacker.invalid',body:{events:[event('page_view')]}})).status,403);
  assert.equal((await admin.request('/api/admin/logout',{method:'POST',body:{},noCsrf:true})).status,403);
});
check('行为真实写入 D1，重复事件编号只计一次，私密字段不入埋点',async()=>{
  const values=[event('page_view'),event('product_view')];
  let result=await customer.request('/api/events',{method:'POST',body:{clientVisitorId:seedVisitor,clientVisitId:randomUUID(),page:values[0].page,language:'en',utmSource:'google',utmMedium:'cpc',events:values,typedValue:'PRIVATE-TYPED-TEXT-NEVER-STORE'}});assert.equal(result.status,200,JSON.stringify(result.data));
  result=await customer.request('/api/events',{method:'POST',body:{events:values}});assert.equal(result.status,200);
  const journey=await admin.request('/api/admin/visitors/'+seedVisitor);assert.equal(journey.status,200);assert.equal(journey.data.items.filter(row=>row.type==='product_view').length,1);assert.doesNotMatch(journey.text,/PRIVATE-TYPED-TEXT/);
  const current=journey.data.items.find(row=>row.type==='product_view');assert.equal(current.page,values[0].page);assert.equal(current.position,'integration_test');assert.equal(current.language,'en');assert.equal(current.source,'google');
});
check('所有关键行为可记录，客户端不能伪造成功询盘',async()=>{
  const types=['spec_expand','image_view','download_click','inquiry_click','whatsapp_click','email_click','form_start','form_failure'];
  assert.equal((await customer.request('/api/events',{method:'POST',body:{events:types.map(type=>event(type))}})).status,200);
  assert.equal((await customer.request('/api/events',{method:'POST',body:{events:[event('inquiry_success')]}})).status,400);
  const current=await admin.request('/api/admin/overview?include_internal=1');assert.equal(current.status,200,JSON.stringify(current.data));assert.equal(current.data.metrics.inquiries.current,0);assert.equal(current.data.metrics.contact_clicks.current,3);assert.equal(current.data.metrics.form_starters.current,1);
});
check('蜜罐、已识别机器人、无效联系信息均不能生成询盘',async()=>{
  for(const body of [{...inquiry(),website:'spam.example'},{...inquiry(),email:'invalid'}])assert.equal((await customer.request('/api/inquiries',{method:'POST',body})).status,400);
  const bot=new Client('Googlebot/2.1');assert.equal((await bot.request('/api/events',{method:'POST',body:{events:[event('page_view')]}})).status,200);assert.equal((await bot.request('/api/inquiries',{method:'POST',body:inquiry()})).status,400);
});
check('表单真实入库，成功只在服务端生成，并发重试仅保存一条',async()=>{
  await pause(1900);
  const body={...inquiry(),formToken:proofA};
  const results=await Promise.all([customer.request('/api/inquiries',{method:'POST',body}),customer.request('/api/inquiries',{method:'POST',body})]);
  assert.deepEqual(results.map(result=>result.status).sort(),[200,201],JSON.stringify(results.map(result=>result.data)));
  assert.equal(results[0].data.id,results[1].data.id);savedA=results[0].data;
  const repeated=await customer.request('/api/inquiries',{method:'POST',body:{...body,idempotencyKey:randomUUID()}});assert.equal(repeated.status,200);assert.equal(repeated.data.id,savedA.id);
  const detail=await admin.request('/api/admin/inquiries/'+savedA.id);assert.equal(detail.data.name,body.name);assert.equal(detail.data.company,'QA Company');assert.equal(detail.data.visitor_id,seedVisitor);assert.equal(detail.data.submission_page,'/contact/');assert.equal(detail.data.source_page,body.sourcePage);assert.equal(detail.data.source,'google');assert.equal(detail.data.is_internal,1);
  const journey=await admin.request('/api/admin/visitors/'+seedVisitor);assert.equal(journey.data.items.filter(row=>row.type==='inquiry_success').length,1);
  assert.equal((await customer.request('/api/inquiries',{method:'POST',body:{...body,message:'A conflicting new requirement using the same key.'}})).status,409);
  assert.equal((await customer.request('/api/inquiries',{method:'POST',body:{...body,context:'A different sample reference under the same submission key.'}})).status,409);
});
check('延迟上报保留操作发生时间，异常设备时钟回退到服务端时间',async()=>{
  const detail=(await admin.request('/api/admin/inquiries/'+savedA.id)).data;
  const delayed={...event('form_start'),occurredAt:detail.created_at-1500},invalid={...event('image_view'),occurredAt:Date.now()+365*86400000};
  assert.equal((await customer.request('/api/events',{method:'POST',body:{events:[delayed,invalid]}})).status,200);
  const rows=(await admin.request('/api/admin/visitors/'+seedVisitor)).data.items,start=rows.find(row=>row.id===delayed.id),badClock=rows.find(row=>row.id===invalid.id),success=rows.find(row=>row.inquiry_id===savedA.id);
  assert.equal(start.occurred_at,delayed.occurredAt);assert.ok(start.received_at>start.occurred_at);assert.ok(rows.indexOf(start)<rows.indexOf(success));
  assert.equal(badClock.occurred_at,badClock.received_at);assert.equal(success.occurred_at,success.received_at);
  assert.equal((await customer.request('/api/events',{method:'POST',body:{events:[delayed]}})).status,200);
  assert.equal((await admin.request('/api/admin/visitors/'+seedVisitor)).data.items.filter(row=>row.id===delayed.id).length,1);
});
check('第二个访客及语言、产品、来源可准确关联',async()=>{
  const visited=await second.request('/api/events',{method:'POST',body:{page:'/products/cbb61-fan-capacitor/',language:'es',referrer:'https://www.bing.com/search?q=private-query',events:[{...event('page_view','CBB61','/products/cbb61-fan-capacitor/'),language:'es'},{...event('product_view','CBB61'),language:'es'}]}});assert.equal(visited.status,200);
  const response=await second.request('/api/inquiries',{method:'POST',body:{...inquiry('B'),formToken:proofB}});assert.equal(response.status,201,JSON.stringify(response.data));savedB=response.data;
  const detail=await admin.request('/api/admin/inquiries/'+savedB.id);assert.equal(detail.data.language,'es');assert.equal(detail.data.source,'www.bing.com');assert.notEqual(detail.data.visitor_id,seedVisitor);assert.doesNotMatch(detail.text,/private-query/);
});
check('统计独立复核：UV、访问、PV、回访、联系点击和真实询盘一致',async()=>{
  const response=await admin.request('/api/admin/overview?include_internal=1');assert.equal(response.status,200,JSON.stringify(response.data));const m=response.data.metrics;
  assert.equal(m.visitors.current,2);assert.equal(m.visits.current,2);assert.equal(m.page_views.current,2);assert.equal(m.returning_visitors.current,1);assert.equal(m.contact_clicks.current,3);assert.equal(m.form_starters.current,1);assert.equal(m.inquiries.current,2);assert.equal(m.conversion_rate.current,100);
  assert.equal(m.visitors.previous,1);assert.equal(m.page_views.previous,2);assert.equal(m.inquiries.previous,0);assert.equal(m.inquiries.change,null);
  assert.equal(response.data.trend.length,7);assert.equal(response.data.trend.reduce((sum,row)=>sum+Number(row.current.page_views||0),0),2);assert.equal(response.data.trend.reduce((sum,row)=>sum+Number(row.previous.page_views||0),0),2);
  const list=await admin.request('/api/admin/inquiries?include_internal=1');assert.equal(list.data.total,m.inquiries.current);
});
check('内部测试与机器人默认排除，未知数据不会被编造',async()=>{
  const ordinary=await admin.request('/api/admin/overview');assert.equal(ordinary.data.metrics.visitors.current,0);assert.equal(ordinary.data.metrics.inquiries.current,0);
  const list=await admin.request('/api/admin/inquiries');assert.equal(list.data.total,0);
  const known=await admin.request('/api/admin/overview?include_internal=1');assert.equal(known.data.metrics.visitors.current,2);assert.ok(known.data.countries.every(row=>row.label==='unknown'));
});
check('日期、来源、国家、产品、语言筛选和搜索可组合使用',async()=>{
  const source=await admin.request('/api/admin/overview?include_internal=1&source=google&product=CBB60&language=en&country=unknown');assert.equal(source.data.metrics.visitors.current,1);assert.equal(source.data.metrics.inquiries.current,1);
  const filtered=await admin.request('/api/admin/inquiries?include_internal=1&source=google&product=CBB60&language=en&country=China&q=QA');assert.equal(filtered.data.total,1);assert.equal(filtered.data.items[0].id,savedA.id);
  assert.equal((await admin.request('/api/admin/inquiries?include_internal=1&q=%25%27%20OR%201%3D1--')).data.total,0);
  assert.equal((await admin.request('/api/admin/overview?from=2026-02-30')).status,400);
  assert.equal((await admin.request('/api/admin/overview?from=2020-01-01&to=2026-10-22')).status,400);
});
check('跟进状态、备注、未读标记与并发版本校验真实保存',async()=>{
  let detail=(await admin.request('/api/admin/inquiries/'+savedA.id)).data;assert.equal(detail.read_at,null);
  let changed=await admin.request('/api/admin/inquiries/'+savedA.id,{method:'PATCH',body:{status:'following',read:true,version:detail.version}});assert.equal(changed.status,200);assert.equal(changed.data.status,'following');
  assert.equal((await admin.request('/api/admin/inquiries/'+savedA.id,{method:'PATCH',body:{status:'completed',version:detail.version}})).status,409);
  assert.equal((await admin.request('/api/admin/inquiries/'+savedA.id+'/notes',{method:'POST',body:{note:'已联系，等待客户确认电压。 <script>alert(1)</script>'}})).status,201);
  detail=(await admin.request('/api/admin/inquiries/'+savedA.id)).data;assert.equal(detail.notes.length,1);assert.equal(detail.status,'following');assert.ok(detail.read_at);
  const unread=await admin.request('/api/admin/inquiries?include_internal=1&unread=1');assert.equal(unread.data.total,1);
  changed=await admin.request('/api/admin/inquiries/'+savedA.id,{method:'PATCH',body:{read:false,version:detail.version}});assert.equal(changed.status,200);assert.equal((await admin.request('/api/admin/inquiries?include_internal=1&unread=1')).data.total,2);
});
check('标记垃圾后不再计为有效成功询盘，但原始轨迹保留',async()=>{
  let detail=(await admin.request('/api/admin/inquiries/'+savedA.id)).data;
  await admin.request('/api/admin/inquiries/'+savedA.id,{method:'PATCH',body:{status:'spam',version:detail.version}});
  const metrics=(await admin.request('/api/admin/overview?include_internal=1')).data.metrics;assert.equal(metrics.inquiries.current,1);assert.equal(metrics.page_views.current,2);assert.equal(metrics.conversion_rate.current,50);
  const journey=(await admin.request('/api/admin/visitors/'+seedVisitor)).data;assert.equal(journey.items.filter(row=>row.inquiry_id===savedA.id).length,1);
  detail=(await admin.request('/api/admin/inquiries/'+savedA.id)).data;await admin.request('/api/admin/inquiries/'+savedA.id,{method:'PATCH',body:{status:'following',version:detail.version}});
});
check('CSV 仅登录后可导出，包含备注并防止表格公式执行',async()=>{
  const result=await admin.request('/api/admin/inquiries/export?include_internal=1');assert.equal(result.status,200);assert.match(result.headers.get('content-type'),/text\/csv/);assert.match(result.text,/'=LOCAL-TEST-CLIENT/);assert.match(result.text,/等待客户确认电压/);assert.doesNotMatch(result.text,/idempotency_hash|payload_hash|token_hash/);
});
check('请求大小和匿名批次限制生效',async()=>{
  assert.equal((await customer.request('/api/events',{method:'POST',body:{events:Array.from({length:21},()=>event('page_view'))}})).status,400);
  assert.equal((await customer.request('/api/inquiries',{method:'POST',body:{...inquiry('C'),message:'x'.repeat(30000)}})).status,413);
});
check('停止并重启 Worker 后询盘、备注和会话仍可读取',async()=>{
  await stop();await start();
  const detail=await admin.request('/api/admin/inquiries/'+savedA.id);assert.equal(detail.status,200);assert.equal(detail.data.notes.length,1);assert.equal(detail.data.status,'following');
  const stats=await admin.request('/api/admin/overview?include_internal=1');assert.equal(stats.data.metrics.inquiries.current,2);
  // Verify persisted SQL independently of the API's aggregate implementation.
  const raw=JSON.parse(db("SELECT (SELECT COUNT(*) FROM inquiries) inquiries,(SELECT COUNT(*) FROM events WHERE type='inquiry_success') success_events,(SELECT COUNT(*) FROM inquiry_notes) notes"));
  assert.equal(raw[0].results[0].inquiries,2);assert.equal(raw[0].results[0].success_events,2);assert.equal(raw[0].results[0].notes,1);
});
check('未知系列真实保存且可筛选，不被归为 CBB60 或与已知多选混淆',async()=>{
  const browser=new Client(),proof=(await browser.request('/api/public-config')).data.formToken;
  await pause(1900);
  const unknownUrl='/api/admin/overview?include_internal=1&product=unknown',knownUrl='/api/admin/overview?include_internal=1&product=CBB60';
  const unknownBefore=(await admin.request(unknownUrl)).data.metrics.inquiries.current,knownBefore=(await admin.request(knownUrl)).data.metrics.inquiries.current;
  assert.equal((await browser.request('/api/inquiries',{method:'POST',body:{...inquiry('INVALID-MIX'),products:['unknown','CBB60'],formToken:proof}})).status,400);
  const multiple=await browser.request('/api/inquiries',{method:'POST',body:{...inquiry('MULTI'),products:['CBB60','CBB61'],formToken:proof}});
  assert.equal(multiple.status,201,JSON.stringify(multiple.data));
  assert.equal((await admin.request(unknownUrl)).data.metrics.inquiries.current,unknownBefore);
  const body={...inquiry('UNKNOWN'),products:['unknown'],context:'Sample reference: P029\nConfiguration ID: label-p029-20',formToken:proof};
  const saved=await browser.request('/api/inquiries',{method:'POST',body});assert.equal(saved.status,201,JSON.stringify(saved.data));
  const repeated=await browser.request('/api/inquiries',{method:'POST',body});assert.equal(repeated.status,200);assert.equal(repeated.data.id,saved.data.id);
  const detail=(await admin.request('/api/admin/inquiries/'+saved.data.id)).data;assert.deepEqual(JSON.parse(detail.products),['unknown']);assert.match(detail.context,/Configuration ID: label-p029-20/);
  const rows=(await admin.request('/api/admin/inquiries?include_internal=1&product=unknown')).data;assert.equal(rows.total,1);assert.equal(rows.items[0].id,saved.data.id);
  assert.equal((await admin.request(unknownUrl)).data.metrics.inquiries.current,unknownBefore+1);
  assert.equal((await admin.request(knownUrl)).data.metrics.inquiries.current,knownBefore+1);
  const csv=(await admin.request('/api/admin/inquiries/export?include_internal=1&product=unknown')).text;assert.match(csv,/未知/);assert.match(csv,new RegExp(saved.data.reference));
  const raw=JSON.parse(db(`SELECT COUNT(*) total FROM events WHERE inquiry_id='${saved.data.id}' AND type='inquiry_success'`));assert.equal(raw[0].results[0].total,1);
});
check('退出后会话失效，登录失败过多会被限流',async()=>{
  assert.equal((await admin.request('/api/admin/logout',{method:'POST',body:{}})).status,200);assert.equal((await admin.request('/api/admin/inquiries')).status,401);
  const wrong=new Client();let last;for(let index=0;index<10;index++)last=await wrong.request('/api/admin/login',{method:'POST',body:{email:loginEmail,password:'incorrect-local-password'}});assert.equal(last.status,429);assert.ok(Number(last.headers.get('retry-after'))>0);
});
