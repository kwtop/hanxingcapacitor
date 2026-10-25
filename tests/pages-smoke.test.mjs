import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {access,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,resolve,sep} from 'node:path';
import {randomUUID} from 'node:crypto';
import net from 'node:net';

const root=fileURLToPath(new URL('../',import.meta.url)),runId=randomUUID(),persist=join(root,'.wrangler',`pages-test-${runId}`),base='http://127.0.0.1:8798';
const pause=ms=>new Promise(done=>setTimeout(done,ms));
const agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36';
const cli=args=>{const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:60000});assert.equal(result.status,0,(result.stderr||result.stdout).slice(-2000));return result.stdout;};

test('真实 Pages Functions 路由、静态页面、登录和 D1 入库联通',async()=>{
  let child,output='';const jar=new Map();let csrf='';
  const call=async(path,body,method='GET')=>{
    const headers=new Headers({'User-Agent':agent});
    if(jar.size)headers.set('Cookie',[...jar].map(([key,value])=>`${key}=${value}`).join('; '));
    if(body){headers.set('Content-Type','application/json');headers.set('Origin',base);if(csrf)headers.set('X-CSRF-Token',csrf);}
    const response=await fetch(base+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
    for(const value of response.headers.getSetCookie()){const [pair]=value.split(';'),index=pair.indexOf('=');jar.set(pair.slice(0,index),pair.slice(index+1));}
    const text=await response.text();let data;try{data=JSON.parse(text);}catch{}
    return {status:response.status,data,text,headers:response.headers};
  };
  try{
    await access(join(root,'.cloudflare-site','contact','index.html'));
    await new Promise((done,reject)=>{const probe=net.createServer();probe.once('error',reject);probe.listen(8798,'127.0.0.1',()=>probe.close(done));});
    cli(['d1','migrations','apply','DB','--local','--config','wrangler.jsonc','--persist-to',persist]);
    child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','pages','dev','.cloudflare-site','--ip','127.0.0.1','--port','8798','--inspector-port','0','--persist-to',persist,'--show-interactive-dev-session=false'],{cwd:root,stdio:['ignore','pipe','pipe'],windowsHide:true});
    for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>output=(output+chunk.toString()).slice(-8000));
    let ready=false;
    for(let attempt=0;attempt<120;attempt++){if(child.exitCode!==null)throw new Error('Pages stopped: '+output.slice(-2500));try{const response=await call('/api/health/');if(response.data?.app==='hanxing-admin'){ready=true;break;}}catch{}await pause(250);}
    assert.ok(ready,'Pages not ready: '+output.slice(-2500));
    const page=await call('/contact/');assert.equal(page.status,200);assert.match(page.text,/contact-inquiry-form/);assert.match(page.text,/satechi-site/);
    assert.equal((await call('/admin-assets/admin.js')).status,200);
    assert.match((await call('/admin/')).text,/登录后台/);
    assert.equal((await call('/api/admin/inquiries/')).status,401);assert.equal((await call('/api/admin/inquiries/export/')).status,401);
    const accessText=await readFile(join(root,'.admin-local','access.txt'),'utf8');
    const logged=await call('/api/admin/login/',{email:accessText.match(/邮箱：([^\r\n]+)/)[1],password:accessText.match(/密码：([^\r\n]+)/)[1]},'POST');assert.equal(logged.status,200);csrf=logged.data.csrf;
    assert.match((await call('/admin/')).text,/访问概览/);
    const proof=await call('/api/public-config/');assert.equal(proof.status,200);await pause(1900);
    const event={id:randomUUID(),occurredAt:Date.now(),type:'page_view',page:'/products/cbb65-air-conditioner-capacitor/',product:'CBB65',language:'en',position:'pages_smoke'};
    for(let index=0;index<2;index++)assert.equal((await call('/api/events/',{page:event.page,events:[event]},'POST')).status,200);
    const body={name:'Pages 本地验收',company:'Pages Local QA',email:'pages-qa@example.invalid',country:'China',products:['CBB65'],message:'Isolated local Pages runtime check, no external notification.',page:'/contact/',sourcePage:event.page,language:'en',formToken:proof.data.formToken,idempotencyKey:randomUUID()};
    const saved=await call('/api/inquiries/',body,'POST');assert.equal(saved.status,201,JSON.stringify(saved.data));assert.equal(saved.data.saved,true);
    const duplicate=await call('/api/inquiries/',body,'POST');assert.equal(duplicate.status,200);assert.equal(duplicate.data.reference,saved.data.reference);
    const detail=await call('/api/admin/inquiries/'+saved.data.id+'/');assert.equal(detail.data.company,'Pages Local QA');assert.equal(detail.data.source_page,event.page);
    const metrics=(await call('/api/admin/overview/?include_internal=1')).data.metrics;assert.equal(metrics.inquiries.current,1);assert.equal(metrics.page_views.current,1);assert.equal(metrics.contact_clicks.current,0);
    const sql=JSON.parse(cli(['d1','execute','DB','--local','--config','wrangler.jsonc','--persist-to',persist,'--command',"SELECT (SELECT COUNT(*) FROM inquiries) inquiries,(SELECT COUNT(*) FROM events WHERE type='page_view') page_views",'--json']));
    assert.equal(sql[0].results[0].inquiries,1);assert.equal(sql[0].results[0].page_views,1);
    await mkdir(join(root,'.qa'),{recursive:true});await writeFile(join(root,'.qa','pages-smoke.json'),JSON.stringify({checkedAt:new Date().toISOString(),passed:true,runtime:'Cloudflare Pages Functions + local D1',remoteWrites:false,reference:saved.data.reference,checks:['static contact page','protected admin and CSV','password login','real inquiry write','deduplicated events and inquiry','SQL reconciliation']},null,2));
  }finally{
    if(child&&child.exitCode===null){if(process.platform==='win32')spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});else child.kill('SIGTERM');await pause(500);}
    const absolute=resolve(persist);if(!absolute.startsWith(resolve(root)+sep)||!absolute.includes(`${sep}.wrangler${sep}pages-test-`))throw new Error('Unsafe cleanup target');await rm(absolute,{recursive:true,force:true});
  }
});
