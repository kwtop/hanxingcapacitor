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
  const anonymous=new Client();for(const path of ['/api/admin/me','/api/admin/inquiries','/api/admin/inquiries/export','/api/admin/visitors','/api/admin/overview','/api/admin/records?kind=source','/api/admin/records?kind=contact'])assert.equal((await anonymous.request(path)).status,401,path);
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
  const detail=await admin.request('/api/admin/inquiries/'+savedA.id);assert.equal(detail.data.name,body.name);assert.equal(detail.data.company,'QA Company');assert.equal(detail.data.visitor_id,seedVisitor);assert.equal(detail.data.submission_page,'/contact/');assert.equal(detail.data.source_page,body.sourcePage);assert.equal(detail.data.source,'google');assert.ok(!Object.hasOwn(detail.data,'is_internal'));
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
  const to=new Date(Date.now()+8*3600000).toISOString().slice(0,10),from=new Date(Date.parse(to)-6*86400000).toISOString().slice(0,10);
  const response=await admin.request(`/api/admin/overview?include_internal=1&from=${from}&to=${to}`);assert.equal(response.status,200,JSON.stringify(response.data));const m=response.data.metrics;
  assert.equal(m.visitors.current,2);assert.equal(m.visits.current,2);assert.equal(m.page_views.current,2);assert.equal(m.returning_visitors.current,1);assert.equal(m.contact_clicks.current,3);assert.equal(m.form_starters.current,1);assert.equal(m.inquiries.current,2);assert.equal(m.conversion_rate.current,100);
  assert.equal(m.visitors.previous,1);assert.equal(m.page_views.previous,2);assert.equal(m.inquiries.previous,0);assert.equal(m.inquiries.change,null);
  assert.equal(m.whatsapp_email_clicks.current,2);assert.equal(m.whatsapp_email_clicks.previous,1);assert.equal(m.whatsapp_email_clicks.change,100);assert.equal(m.contact_clicks.current,3);
  assert.equal(response.data.trend.length,7);assert.equal(response.data.trend.reduce((sum,row)=>sum+Number(row.current.page_views||0),0),2);assert.equal(response.data.trend.reduce((sum,row)=>sum+Number(row.previous.page_views||0),0),2);
  const list=await admin.request('/api/admin/inquiries?include_internal=1');assert.equal(list.data.total,m.inquiries.current);
});
check('全部访问统一计入，机器人仍排除，未知数据不编造',async()=>{
  const ordinary=await admin.request('/api/admin/overview');assert.equal(ordinary.data.metrics.visitors.current,2);assert.equal(ordinary.data.metrics.inquiries.current,2);
  const list=await admin.request('/api/admin/inquiries');assert.equal(list.data.total,2);assert.ok(!Object.hasOwn(list.data,'internalTotal'));
  const known=await admin.request('/api/admin/overview?include_internal=1');assert.deepEqual(known.data.metrics,ordinary.data.metrics);assert.ok(known.data.countries.every(row=>row.label==='unknown'));
});
check('访问概览默认今日，联系入口点击与成功询盘分别统计',async()=>{
  const data=(await admin.request('/api/admin/overview?include_internal=1')).data;
  const today=new Date(Date.now()+8*3600000).toISOString().slice(0,10);
  assert.equal(data.period.from,today);assert.equal(data.period.to,today);assert.equal(data.period.days,1);
  assert.equal(data.trend.length,24);assert.equal(data.trendGranularity,'hour');assert.equal(data.contactActions.reduce((sum,row)=>sum+row.actions,0),data.metrics.contact_clicks.current);
  assert.deepEqual(Object.fromEntries(data.contactActions.map(row=>[row.label,row.actions])),{email_click:1,inquiry_click:1,whatsapp_click:1});
  assert.equal(data.metrics.whatsapp_email_clicks.current,2);
  assert.equal(data.recentContacts.length,3);assert.ok(data.recentContacts.every(row=>['email_click','inquiry_click','whatsapp_click'].includes(row.type)));
  assert.ok(data.recentContacts.every(row=>!Object.hasOwn(row,'is_internal')));assert.ok(!JSON.stringify(data.recentContacts).includes('qa-a@example.invalid'));
  const unfiltered=(await admin.request('/api/admin/overview')).data;assert.deepEqual(unfiltered.contactActions,data.contactActions);assert.deepEqual(unfiltered.recentContacts,data.recentContacts);assert.equal(unfiltered.metrics.whatsapp_email_clicks.current,2);
  const scoped=(await admin.request('/api/admin/inquiries?source=google&product=CBB60')).data;assert.equal(scoped.total,1);assert.ok(!Object.hasOwn(scoped,'internalTotal'));
});
check('单日按北京时间分 24 小时，昨日对比前日，未来小时不填零',async()=>{
  const today=new Date(Date.now()+8*3600000).toISOString().slice(0,10),todayStart=Date.parse(today+'T00:00:00+08:00'),start=todayStart-86400000;
  const selected=new Date(start+8*3600000).toISOString().slice(0,10),before=new Date(start-86400000+8*3600000).toISOString().slice(0,10),visitor=randomUUID(),visits=[randomUUID(),randomUUID()];
  const timestamps=[start-1,start,start+3600000-1,start+3600000,start+23*3600000,start+86400000-1];
  db(`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${visitor}',${start-1},${todayStart-1});
${visits.map((id,index)=>`INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,device,language,is_internal) VALUES('${id}','${visitor}',${index?start:start-1},${index?todayStart-1:start-1},'/','hourly_qa','referral','unknown','desktop','en',1);`).join('\n')}
${timestamps.map((time,index)=>`INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,product,language,position,source,channel,country,device,is_internal) VALUES('${randomUUID()}',${time},${time},'${visitor}','${visits[index?1:0]}','page_view','/','CBB60','en','hourly_qa','hourly_qa','referral','unknown','desktop',1);`).join('\n')}`);
  const data=(await admin.request(`/api/admin/overview?include_internal=1&source=hourly_qa&from=${selected}&to=${selected}`)).data;
  assert.equal(data.trendGranularity,'hour');assert.equal(data.period.previousFrom,before);assert.equal(data.trend.length,24);
  assert.deepEqual(data.trend.map(row=>row.hour),Array.from({length:24},(_,i)=>i));
  assert.equal(data.trend[0].current.page_views,2);assert.equal(data.trend[1].current.page_views,1);assert.equal(data.trend[23].current.page_views,2);assert.equal(data.trend[23].previous.page_views,1);
  assert.equal(data.trend.reduce((sum,row)=>sum+Number(row.current.page_views||0),0),5);assert.equal(data.metrics.page_views.current,5);assert.equal(data.metrics.page_views.previous,1);
  assert.ok(data.trend.every(row=>row.current!==null&&!row.currentPartial));
  assert.equal(data.metrics.visitors.current,1);assert.equal(data.trend.reduce((sum,row)=>sum+Number(row.current.visitors||0),0),3);
  const current=(await admin.request('/api/admin/overview?include_internal=1&source=hourly_qa')).data;
  const hour=Math.floor((current.generatedAt-todayStart)/3600000);
  assert.equal(current.trend.length,24);assert.equal(current.trend[hour].currentPartial,true);
  assert.ok(current.trend.filter(row=>row.hour>hour).every(row=>row.current===null));
  assert.ok(current.trend.filter(row=>row.hour<=hour).every(row=>row.current!==null));
  assert.equal(current.trend.reduce((sum,row)=>sum+Number(row.previous.page_views||0),0),5);
  assert.equal((await admin.request(`/api/admin/overview?source=hourly_qa&from=${selected}&to=${selected}`)).data.metrics.page_views.current,5);
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
check('联系方式至少填一项：单填邮箱或电话可入库，两项空白或无效邮箱被拒绝',async()=>{
  // Keep this fixture's request budget separate from earlier inquiry tests.
  const headers={'CF-Connecting-IP':'192.0.2.41'};
  const browser=new Client(),proof=(await browser.request('/api/public-config',{headers})).data.formToken;
  await pause(1900);
  for(const fields of [{email:'',phone:''},{email:'  ',phone:'  '},{email:'invalid',phone:'+44 7700 900123'}]){
    const result=await browser.request('/api/inquiries',{method:'POST',headers,body:{...inquiry('CONTACT-INVALID'),...fields,formToken:proof}});
    assert.equal(result.status,400,JSON.stringify(result.data));assert.equal(result.data.code,'validation');
  }
  for(const fields of [{email:'qa-email-only@example.invalid',phone:''},{email:'',phone:'+44 7700 900123'}]){
    const saved=await browser.request('/api/inquiries',{method:'POST',headers,body:{...inquiry('CONTACT-SINGLE'),...fields,formToken:proof}});
    assert.equal(saved.status,201,JSON.stringify(saved.data));
    const detail=(await admin.request('/api/admin/inquiries/'+saved.data.id)).data;
    assert.equal(detail.email,fields.email);assert.equal(detail.phone,fields.phone);
  }
});
check('同一匿名访客按北京时间每天仅一条，跨会话回访合并、跨日分开且取当日最近地区和浏览器语言',async()=>{
  const today=new Date(Date.now()+8*3600000).toISOString().slice(0,10),start=Date.parse(today+'T00:00:00+08:00')-86400000;
  const yesterday=new Date(start+8*3600000).toISOString().slice(0,10),before=new Date(start-86400000+8*3600000).toISOString().slice(0,10),visitor=randomUUID(),sessions=[randomUUID(),randomUUID(),randomUUID()];
  const times=[start-1,start+3600000,start+7200000,start+10800000];
  db(`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${visitor}',${start-1},${times[3]});
${sessions.map((id,index)=>`INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,device,language,is_internal${index?',city,browser_language':''}) VALUES('${id}','${visitor}',${times[index?index+1:0]},${times[index?index+1:0]},'/es/','visitor_day_qa','organic_search','${index===2?'BR':index===1?'MX':'unknown'}','desktop','es',1${index?`, '${index===1?'Guadalajara':'São Paulo'}','${index===1?'es-MX':'pt-BR'}'`:''});`).join('\n')}
${times.map((time,index)=>`INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,product,language,source,channel,country,device,is_internal) VALUES('${randomUUID()}',${time},${time},'${visitor}','${sessions[index===0?0:index===3?2:1]}','page_view','/es/','CBB60','es','visitor_day_qa','organic_search','${index===3?'BR':index?'MX':'unknown'}','desktop',1);`).join('\n')}`);
  const daily=(await admin.request(`/api/admin/visitors?include_internal=1&source=visitor_day_qa&from=${yesterday}&to=${yesterday}`)).data;
  assert.equal(daily.total,1);assert.equal(daily.uniqueVisitors,1);assert.equal(daily.grouping,'visitor_day');assert.equal(daily.timeZone,'Asia/Shanghai');
  const row=daily.items[0];assert.equal(row.visitor_id,visitor);assert.equal(row.day,yesterday);assert.equal(row.visits,2);assert.equal(row.events,3);assert.equal(row.page_views,3);assert.equal(row.is_returning,1);assert.equal(row.country,'BR');assert.equal(row.city,'São Paulo');assert.equal(row.browser_language,'pt-BR');assert.equal(row.first_seen,times[1]);assert.equal(row.last_seen,times[3]);assert.ok(!Object.hasOwn(row,'inquiries'));
  const period=(await admin.request(`/api/admin/visitors?include_internal=1&source=visitor_day_qa&from=${before}&to=${yesterday}&language=es&q=${visitor.slice(0,8)}`)).data;
  assert.equal(period.total,2);assert.equal(period.uniqueVisitors,1);assert.deepEqual(period.items.map(item=>item.day),[yesterday,before]);assert.equal(period.items[1].city,'unknown');assert.equal(period.items[1].browser_language,'unknown');assert.equal(period.items[1].is_returning,0);
  assert.equal((await admin.request(`/api/admin/visitors?source=visitor_day_qa&from=${before}&to=${yesterday}`)).data.total,2);
  const journey=(await admin.request('/api/admin/visitors/'+visitor)).data;assert.equal(journey.items.length,4);assert.equal(journey.items[3].city,'São Paulo');assert.equal(journey.items[3].browser_language,'pt-BR');assert.equal(journey.items[3].language,'es');
  assert.equal(journey.summary.events,4);assert.equal(journey.summary.visits,3);assert.equal(journey.summary.day,null);assert.equal(journey.context.country,'BR');assert.equal(journey.context.city,'São Paulo');
  const selected=(await admin.request('/api/admin/visitors/'+visitor+'?day='+yesterday+'&include_internal=1')).data;
  assert.equal(selected.summary.day,yesterday);assert.equal(selected.items.length,3);assert.equal(selected.summary.events,3);assert.equal(selected.summary.page_views,3);assert.equal(selected.summary.visits,2);
  assert.equal(selected.summary.first_seen,times[1]);assert.equal(selected.summary.last_seen,times[3]);assert.equal(selected.context.city,'São Paulo');assert.equal(selected.context.browser_language,'pt-BR');
  const oldDay=(await admin.request('/api/admin/visitors/'+visitor+'?day='+before+'&include_internal=1')).data;
  assert.equal(oldDay.items.length,1);assert.equal(oldDay.context.country,'unknown');assert.equal(oldDay.context.city,'unknown');assert.equal(oldDay.summary.visits,1);
  const noInternal=(await admin.request('/api/admin/visitors/'+visitor+'?day='+yesterday)).data;
  assert.equal(noInternal.items.length,3);assert.equal(noInternal.summary.events,3);assert.equal(noInternal.context.city,'São Paulo');
  for(const day of ['2026-02-30','not-a-date','2026-1-1'])assert.equal((await admin.request('/api/admin/visitors/'+visitor+'?day='+day)).status,400);
});
check('新访客真实保存浏览器语言，和网站语言分开；旧会话仅在再访问时补齐缺失信息',async()=>{
  const client=new Client(),visitor=randomUUID(),body={clientVisitorId:visitor,language:'en',browser_language:'forged',city:'Fake city',events:[event('page_view')]};
  assert.equal((await client.request('/api/events',{method:'POST',headers:{'Accept-Language':'zh-cn,zh;q=0.9'},body})).status,200);
  let data=(await admin.request('/api/admin/visitors?include_internal=1&q='+visitor)).data;
  assert.equal(data.total,1);assert.equal(data.items[0].browser_language,'zh-CN');assert.equal(data.items[0].city,'unknown');assert.equal(data.items[0].country,'unknown');
  let journey=(await admin.request('/api/admin/visitors/'+visitor)).data;assert.equal(journey.items[0].language,'en');assert.equal(journey.items[0].browser_language,'zh-CN');
  const session=journey.items[0].visit_id;db(`UPDATE visits SET browser_language='unknown' WHERE id='${session}'`);
  assert.equal((await client.request('/api/events',{method:'POST',headers:{'Accept-Language':'es-mx,es;q=0.8'},body:{events:[event('page_view')]}})).status,200);
  data=(await admin.request('/api/admin/visitors?include_internal=1&q='+visitor)).data;assert.equal(data.total,1);assert.equal(data.items[0].browser_language,'es-MX');assert.equal(data.items[0].visits,1);assert.equal(data.items[0].page_views,2);
});
check('来源明细与联系点击可逐条关联轨迹，微信、位置、自然与付费归因不会混淆',async()=>{
  const client=new Client(),visitor=randomUUID(),page='/es/contact/',events=[event('page_view','CBB65',page),event('wechat_click','CBB65',page),event('whatsapp_click','CBB65',page),event('email_click','CBB65',page)];
  events[1].position='contact_wechat_qr';events[2].position='contact_whatsapp_qr';events[3].position='contact_form_email_1';
  const response=await client.request('/api/events',{method:'POST',body:{clientVisitorId:visitor,page,language:'es',referrer:'https://www.google.com/search?q=PRIVATE-SEARCH#secret',events}});
  assert.equal(response.status,200,JSON.stringify(response.data));
  assert.equal((await client.request('/api/events',{method:'POST',body:{events:[events[1]]}})).status,200);
  const scope='include_internal=1&source=www.google.com&channel=organic_search';
  const overview=(await admin.request('/api/admin/overview?'+scope)).data;
  assert.equal(overview.metrics.messaging_clicks.current,3);assert.equal(overview.metrics.contact_clicks.current,3);assert.equal(overview.metrics.whatsapp_email_clicks.current,2);assert.equal(overview.metrics.wechat_clicks.current,1);
  assert.equal(overview.contactActions.reduce((sum,row)=>sum+row.actions,0),3);assert.equal(overview.sourceDetails[0].visits,1);assert.equal(overview.organicSources[0].source,'www.google.com');
  const sources=(await admin.request('/api/admin/records?kind=source&'+scope)).data;
  assert.equal(sources.total,1);assert.equal(sources.summary.page_views,1);assert.equal(sources.items[0].entry_page,page);assert.equal(sources.items[0].referrer_url,'https://www.google.com/search');assert.equal(sources.items[0].visitor_id,visitor);
  assert.doesNotMatch(JSON.stringify(sources),/PRIVATE-SEARCH|secret/);
  const contacts=(await admin.request('/api/admin/records?kind=contact&'+scope)).data;assert.equal(contacts.total,3);assert.equal(contacts.summary.visitors,1);
  const selected=(await admin.request('/api/admin/records?kind=contact&contact_type=wechat_click&event_page='+encodeURIComponent(page)+'&position=contact_wechat_qr&'+scope)).data;
  assert.equal(selected.total,1);assert.equal(selected.items[0].id,events[1].id);
  const focused=(await admin.request('/api/admin/visitors/'+visitor+'?focus_event='+events[1].id)).data;
  assert.equal(focused.focusEvent.id,events[1].id);assert.equal(focused.focusEvent.position,'contact_wechat_qr');assert.equal(focused.focusEvent.referrer_url,'https://www.google.com/search');assert.equal(focused.items.length,4);
  assert.equal((await admin.request('/api/admin/records?kind=contact&source=www.google.com')).data.total,3);
  assert.equal((await admin.request('/api/admin/records?kind=contact&'+scope+'&event_page=/different/')).data.total,0);
  for(const query of ['kind=invalid','kind=contact&contact_type=inquiry_success','kind=source&page=1.5','channel=invalid','page=-1'])assert.equal((await admin.request('/api/admin/records?'+query)).status,400,query);
  const paid=new Client();assert.equal((await paid.request('/api/events',{method:'POST',body:{page:'/',utmSource:'www.google.com',utmMedium:'cpc',utmCampaign:'B2B CBB65',events:[event('page_view')]}})).status,200);
  const paidSources=(await admin.request('/api/admin/records?kind=source&include_internal=1&source=www.google.com&channel=paid_search')).data;
  assert.equal(paidSources.total,1);assert.equal(paidSources.items[0].utm_medium,'cpc');assert.equal(paidSources.items[0].utm_campaign,'B2B CBB65');
  assert.equal((await admin.request('/api/admin/records?kind=source&'+scope)).data.total,1);
});
check('点击明细可翻过最近 12 条；并列时间不漏行，焦点操作在 100 条历史之后仍能查到',async()=>{
  const visitor=randomUUID(),visit=randomUUID(),now=Date.now()-10000,ids=Array.from({length:123},()=>randomUUID());
  const fixture=join(work,'contact-pagination.sql');
  await writeFile(fixture,`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${visitor}',${now},${now+500});
INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,device,language,is_internal) VALUES('${visit}','${visitor}',${now},${now+500},'/contact/','pagination_qa','referral','unknown','desktop','en',1);
${ids.map((id,index)=>`INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,position,source,channel,country,device,is_internal) VALUES('${id}',${now+(index===122?500:0)},${now+500},'${visitor}','${visit}','${index===122?'wechat_click':'email_click'}','/contact/','footer_email_1','pagination_qa','referral','unknown','desktop',1);`).join('\n')}`);
  cli(['d1','execute','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist,'--file',fixture]);
  const collected=[];
  for(let page=1;page<=5;page++){
    const data=(await admin.request('/api/admin/records?kind=contact&include_internal=1&source=pagination_qa&page='+page)).data;
    assert.equal(data.total,123);assert.equal(data.summary.visitors,1);collected.push(...data.items.map(row=>row.id));
  }
  assert.equal(collected.length,123);assert.equal(new Set(collected).size,123);assert.deepEqual(new Set(collected),new Set(ids));
  const journey=(await admin.request('/api/admin/visitors/'+visitor+'?focus_event='+ids[122])).data;
  assert.equal(journey.items.length,100);assert.ok(journey.nextCursor);assert.ok(!journey.items.some(row=>row.id===ids[122]));assert.equal(journey.focusEvent.id,ids[122]);
  assert.equal(journey.summary.events,123);assert.equal(journey.summary.contact_clicks,123);assert.equal(journey.context.id,ids[122]);
  const rest=(await admin.request('/api/admin/visitors/'+visitor+'?cursor='+encodeURIComponent(journey.nextCursor))).data;assert.equal(rest.items.length,23);assert.equal(rest.nextCursor,null);
  assert.equal((await admin.request('/api/admin/visitors/'+seedVisitor+'?focus_event='+ids[122])).data.focusEvent,null);
  assert.equal((await admin.request('/api/admin/visitors/'+visitor+'?cursor=invalid')).status,400);
});
check('询盘全部历史倒序、跨页不丢记录，日期与旧测试标记不再隐藏询盘',async()=>{
  const now=Date.now(),today=new Date(now+8*3600000).toISOString().slice(0,10);
  const rows=Array.from({length:28},(_,index)=>({id:randomUUID(),reference:`HX-HISTORY-${String(index).padStart(2,'0')}`,created:now-(120+Math.floor(index/2))*86400000,status:index%3===0?'following':'pending',read:index%4===0?now:null,product:index%2?'CD60':'CBB60',internal:index%2}));
  const fixture=join(work,'inbox-history.sql');
  await writeFile(fixture,rows.map((row,index)=>`INSERT INTO inquiries(id,reference,created_at,updated_at,name,company,email,country,products,message,submission_page,source_page,language,source,channel,is_internal,status,read_at,idempotency_hash,payload_hash) VALUES('${row.id}','${row.reference}',${row.created},${row.created},'Historic Buyer ${String(index).padStart(2,'0')}','History Export Co','history-${index}@example.invalid','Brazil','["${row.product}"]','Existing request for capacitor samples.','/contact/','/products/','en','inbox_history_qa','referral',${row.internal},'${row.status}',${row.read},'${randomUUID()}','${randomUUID()}');`).join('\n'));
  cli(['d1','execute','DB','--local','--config','wrangler.backend.jsonc','--persist-to',persist,'--file',fixture]);
  const expected=rows.toSorted((a,b)=>b.created-a.created||b.id.localeCompare(a.id));
  const first=(await admin.request('/api/admin/inquiries?source=inbox_history_qa')).data;
  const secondPage=(await admin.request('/api/admin/inquiries?source=inbox_history_qa&page=2')).data;
  assert.equal(first.total,28);assert.equal(first.scope,'all_time');assert.equal(first.order,'newest_first');assert.equal(first.pageSize,25);
  const items=[...first.items,...secondPage.items];assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id));assert.equal(new Set(items.map(row=>row.id)).size,28);
  assert.ok(items.every(row=>!Object.hasOwn(row,'is_internal')));
  const dated=(await admin.request(`/api/admin/inquiries?source=inbox_history_qa&from=${today}&to=${today}&include_internal=0`)).data;
  assert.deepEqual(dated.items,first.items);assert.equal(dated.total,28);
  const all=(await admin.request('/api/admin/inquiries')).data,raw=JSON.parse(db('SELECT COUNT(*) total FROM inquiries'))[0].results[0];assert.equal(all.total,raw.total);
  const clamped=(await admin.request('/api/admin/inquiries?source=inbox_history_qa&page=999')).data;assert.equal(clamped.page,2);assert.equal(clamped.items.length,3);
  for(const page of ['1.5','-1','oops'])assert.equal((await admin.request('/api/admin/inquiries?page='+page)).status,400);
  const searched=(await admin.request('/api/admin/inquiries?source=inbox_history_qa&q=Historic%20Buyer%2007')).data;assert.equal(searched.total,1);assert.equal(searched.items[0].id,rows[7].id);
  const filtered=(await admin.request('/api/admin/inquiries?source=inbox_history_qa&product=CD60&status=following&unread=1&country=Brazil&language=en')).data;
  assert.deepEqual(filtered.items.map(row=>row.id),expected.filter(row=>row.product==='CD60'&&row.status==='following'&&row.read===null).map(row=>row.id));
  const csv=await admin.request(`/api/admin/inquiries/export?source=inbox_history_qa&from=${today}&to=${today}`);assert.equal(csv.status,200);
  assert.deepEqual(csv.text.trim().split('\r\n').slice(1).map(line=>line.split(',')[0].replaceAll('"','')),expected.map(row=>row.reference));
  const facets=(await admin.request(`/api/admin/facets?scope=inquiries&from=${today}&to=${today}&source=inbox_history_qa`)).data;
  assert.deepEqual(facets.sources,['inbox_history_qa']);assert.deepEqual(facets.inquiryCountries,['Brazil']);assert.deepEqual(facets.languages,['en']);
});
check('登录管理员和旧测试 Cookie 的新访问统一计入，表单仍真实保存且重传不重复',async()=>{
  const visitor=randomUUID(),headers={'CF-Connecting-IP':'192.0.2.82'};
  admin.jar.set('hx_internal','1');
  const values=[event('page_view'),{...event('whatsapp_click'),position:'footer_whatsapp_1'}];
  assert.equal((await admin.request('/api/events',{method:'POST',headers,body:{clientVisitorId:visitor,utmSource:'admin_scope_qa',utmMedium:'referral',events:values}})).status,200);
  const before=(await admin.request('/api/admin/overview?source=admin_scope_qa')).data;assert.equal(before.metrics.visitors.current,1);assert.equal(before.metrics.contact_clicks.current,1);assert.equal(before.metrics.inquiries.current,0);
  const proof=(await admin.request('/api/public-config',{headers})).data.formToken;await pause(1900);
  const body={...inquiry('ADMIN-SCOPE'),formToken:proof};
  const saved=await admin.request('/api/inquiries',{method:'POST',headers,body});assert.equal(saved.status,201,JSON.stringify(saved.data));
  assert.equal((await admin.request('/api/inquiries',{method:'POST',headers,body})).data.id,saved.data.id);
  assert.equal((await admin.request('/api/events',{method:'POST',headers,body:{events:values}})).status,200);
  const data=(await admin.request('/api/admin/overview?source=admin_scope_qa')).data;assert.equal(data.metrics.inquiries.current,1);assert.equal(data.metrics.page_views.current,1);assert.equal(data.metrics.contact_clicks.current,1);
  const raw=JSON.parse(db(`SELECT (SELECT SUM(is_internal) FROM visits WHERE visitor_id='${visitor}') visit_flags,(SELECT SUM(is_internal) FROM events WHERE visitor_id='${visitor}') event_flags,(SELECT SUM(is_internal) FROM inquiries WHERE visitor_id='${visitor}') inquiry_flags`))[0].results[0];
  assert.deepEqual(raw,{visit_flags:0,event_flags:0,inquiry_flags:0});
  const contacts=(await admin.request('/api/admin/records?kind=contact&source=admin_scope_qa')).data;assert.equal(contacts.total,1);assert.deepEqual(contacts.positions,['footer_whatsapp_1']);assert.ok(!Object.hasOwn(contacts.items[0],'is_internal'));
  const page=(await admin.request('/admin/')).text;assert.doesNotMatch(page,/内部测试|include_internal/);assert.match(page,/全部时间 · 最新在前/);assert.match(page,/清除筛选/);
});
check('历史测试记录与普通记录统一展示，历史机器人记录仍从统计和轨迹排除',async()=>{
  const visitor=randomUUID(),visit=randomUUID(),now=Date.now()-10000,ids=[randomUUID(),randomUUID(),randomUUID()];
  db(`INSERT INTO visitors(id,first_seen,last_seen) VALUES('${visitor}',${now},${now});
INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel,country,device,language) VALUES('${visit}','${visitor}',${now},${now},'/','unified_history_qa','referral','unknown','desktop','en');
${ids.map((id,index)=>`INSERT INTO events(id,occurred_at,visitor_id,visit_id,type,page,position,source,channel,country,device,is_internal,is_bot) VALUES('${id}',${now+index},'${visitor}','${visit}','${index===0?'page_view':'whatsapp_click'}','/','footer_whatsapp_1','unified_history_qa','referral','unknown','desktop',${index===1?1:0},${index===2?1:0});`).join('\n')}`);
  const data=(await admin.request('/api/admin/overview?source=unified_history_qa')).data;
  assert.equal(data.metrics.visitors.current,1);assert.equal(data.metrics.page_views.current,1);assert.equal(data.metrics.contact_clicks.current,1);assert.equal(data.metrics.inquiries.current,0);
  const contacts=(await admin.request('/api/admin/records?kind=contact&source=unified_history_qa')).data;assert.equal(contacts.total,1);assert.equal(contacts.items[0].id,ids[1]);
  const journey=(await admin.request('/api/admin/visitors/'+visitor)).data;assert.equal(journey.items.length,2);assert.equal(journey.summary.events,2);
  const today=new Date(now+8*3600000).toISOString().slice(0,10),daily=(await admin.request('/api/admin/visitors/'+visitor+'?day='+today)).data;assert.equal(daily.items.length,2);
});
check('退出后会话失效，登录失败过多会被限流',async()=>{
  assert.equal((await admin.request('/api/admin/logout',{method:'POST',body:{}})).status,200);assert.equal((await admin.request('/api/admin/inquiries')).status,401);
  const wrong=new Client();let last;for(let index=0;index<10;index++)last=await wrong.request('/api/admin/login',{method:'POST',body:{email:loginEmail,password:'incorrect-local-password'}});assert.equal(last.status,429);assert.ok(Number(last.headers.get('retry-after'))>0);
});
