import { handleBackend } from '../src/server/router';
import type { BackendEnv } from '../src/server/types';
export default {
  async fetch(request: Request,env: BackendEnv): Promise<Response> {
    const path=new URL(request.url).pathname;
    if(path.startsWith('/api/')||path==='/admin'||path.startsWith('/admin/')) return handleBackend(request,env);
    if(env.ASSETS){const url=new URL(request.url);if(url.pathname.startsWith('/admin-assets/'))url.pathname=url.pathname.slice('/admin-assets'.length);return env.ASSETS.fetch(new Request(url,request)) as unknown as Promise<Response>;}
    return new Response('Not found',{status:404});
  },
};
