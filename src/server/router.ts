import type { BackendEnv } from './types';
import { adminPage } from './adminPage';
import { assertOrigin, field, HttpError, json, readJson, secureHeaders } from './http';
import { assertCsrf, identity, login, logout, requireAdmin } from './auth';
import { formConfig, submitInquiry } from './inquiries';
import { collect } from './tracking';
import { ensureVisit } from './visits';
import { rateLimit } from './rate';
import { addNote, exportInquiries, inquiryDetail, listInquiries, updateInquiry } from './adminData';
import { facets, journey, overview, visitors } from './insights';

function withCookies(response: Response, values: string[]) { values.forEach(value => response.headers.append('Set-Cookie',value)); return response; }
export async function handleBackend(request: Request, env: BackendEnv): Promise<Response> {
  try {
    const url=new URL(request.url), path=url.pathname.replace(/\/$/,'')||'/', method=request.method;
    if(path==='/admin'||path.startsWith('/admin/')){
      if(method!=='GET') throw new HttpError(405,'method_not_allowed','请求方式不支持。');
      return adminPage(env.DB?await identity(request,env):null,env);
    }
    if(!env.DB||!env.APP_SECRET||env.APP_SECRET.length<32) throw new HttpError(503,'configuration_missing','服务尚未配置完成。');
    if(path==='/api/health'&&method==='GET'){await env.DB.prepare('SELECT key FROM rate_limits LIMIT 1').first();return json({app:'hanxing-admin',ready:true});}
    if(!['GET','HEAD'].includes(method)) assertOrigin(request,env);
    if(path==='/api/public-config'&&method==='GET') return json(await formConfig(request,env));
    if(path==='/api/session'&&method==='POST'){
      await rateLimit(request,env,'visit',90,600);
      const result=await ensureVisit(request,env,await readJson(request,4096));
      return withCookies(json({visitorId:result.visit.visitor_id,visitId:result.visit.id}),result.cookies);
    }
    if(path==='/api/events'&&method==='POST'){
      const result=await collect(request,env,await readJson(request));
      return withCookies(json({accepted:result.accepted}),result.cookies);
    }
    if(path==='/api/inquiries'&&method==='POST'){
      const result=await submitInquiry(request,env,await readJson(request));
      return withCookies(json({saved:true,id:result.id,reference:result.reference,duplicate:result.duplicate},result.duplicate?200:201),result.cookies);
    }
    if(path==='/api/admin/login'&&method==='POST'){
      const data=await readJson(request,4096),result=await login(request,env,field(data.email,200),field(data.password,200));
      return withCookies(json({email:result.email,csrf:result.csrf}),[result.cookie]);
    }
    if(path.startsWith('/api/admin/')){
      const user=await requireAdmin(request,env);
      if(!['GET','HEAD'].includes(method)) assertCsrf(request,user);
      if(path==='/api/admin/me'&&method==='GET') return json(user);
      if(path==='/api/admin/logout'&&method==='POST') return withCookies(json({ok:true,accessLogout:user.mode==='access'?`https://${env.ACCESS_TEAM_DOMAIN?.replace(/^https:\/\//,'').replace(/\/$/,'')}/cdn-cgi/access/logout`:null}),[await logout(request,env)]);
      if(path==='/api/admin/inquiries'&&method==='GET') return json(await listInquiries(env,url));
      if(path==='/api/admin/inquiries/export'&&method==='GET') return new Response(await exportInquiries(env,url),{headers:{...secureHeaders,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="hanxing-inquiries-${new Date().toISOString().slice(0,10)}.csv"`}});
      const inquiry=path.match(/^\/api\/admin\/inquiries\/([a-f0-9-]{36})(\/notes)?$/i);
      if(inquiry){
        if(inquiry[2]&&method==='POST') return json(await addNote(env,inquiry[1],await readJson(request,10000),user),201);
        if(!inquiry[2]&&method==='GET') return json(await inquiryDetail(env,inquiry[1]));
        if(!inquiry[2]&&method==='PATCH') return json(await updateInquiry(env,inquiry[1],await readJson(request,4096),user));
      }
      if(path==='/api/admin/overview'&&method==='GET') return json(await overview(env,url));
      if(path==='/api/admin/facets'&&method==='GET') return json(await facets(env,url));
      if(path==='/api/admin/visitors'&&method==='GET') return json(await visitors(env,url));
      const visitor=path.match(/^\/api\/admin\/visitors\/([a-f0-9-]{36})$/i);
      if(visitor&&method==='GET') return json(await journey(env,visitor[1],url));
    }
    throw new HttpError(404,'not_found','没有找到这个接口。');
  }catch(error){
    if(error instanceof HttpError) return json({error:error.message,code:error.code},error.status,error.retryAfter?{'Retry-After':String(error.retryAfter)}:{});
    // Never log request bodies, form values, cookies or customer details.
    console.error('Backend request failed',{path:new URL(request.url).pathname,error:error instanceof Error?error.name:'UnknownError'});
    return json({error:'服务暂时不可用，请重试。',code:'server_error'},500);
  }
}
