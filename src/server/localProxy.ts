/** The production Cloudflare Pages Functions use router.ts directly. */
export async function localBackendProxy(request: Request): Promise<Response> {
  if (!import.meta.env.DEV) return new Response(JSON.stringify({error:'This endpoint requires the Cloudflare Pages Functions runtime.',code:'runtime_required'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  const original=new URL(request.url),target=new URL(original.pathname+original.search,process.env.LOCAL_BACKEND_URL||'http://127.0.0.1:8796');
  try{
    const headers=new Headers(request.headers); for(const key of ['host','connection','content-length','transfer-encoding'])headers.delete(key); headers.set('Accept-Encoding','identity');
    const response=await fetch(target,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:await request.arrayBuffer(),redirect:'manual',signal:AbortSignal.timeout(15000)});
    const output=new Headers(response.headers); for(const key of ['Content-Length','Content-Encoding','Transfer-Encoding','Connection'])output.delete(key);
    return new Response(response.body,{status:response.status,headers:output});
  }catch{return new Response(JSON.stringify({error:'Start the local backend with npm run dev:backend.',code:'backend_unavailable'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
}
