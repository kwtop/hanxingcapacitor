import {defineMiddleware} from 'astro:middleware';
import {translatedPaths} from './i18n/routes';
import {localizeHtml} from './i18n/localizeHtml';
import {indexablePaths,utilityPaths} from './lib/seoRoutes';
import {publicSiteReady} from './lib/publicSite';
import {localBackendProxy} from './server/localProxy';
export const onRequest=defineMiddleware(async(context,next)=>{
  const path=context.url.pathname;
  if(import.meta.env.DEV&&(path.startsWith('/api/')||path==='/admin'||path.startsWith('/admin/')))return localBackendProxy(context.request);
  const retired:Record<string,string>={'/certificates/':'/factory/#model-records','/case-studies/':'/applications/','/markets/':'/buying-guide/'};
  const normalized=path.endsWith('/')?path:path+'/';
  if(retired[normalized])return context.redirect(retired[normalized],301);
  const localized=path.match(/^\/(es|ar)(\/.*)?$/);
  let source=path,response:Response;
  if(localized){
    const raw=localized[2]||'/';source=raw.endsWith('/')?raw:raw+'/';
    const alias=source==='/request-a-quote/'?'/contact/':retired[source];
    if(alias){const target=new URL((localized[1]==='es'?'/es':'')+alias,context.url);target.search=context.url.search;return context.redirect(target.pathname+target.search+target.hash,301);}
    if(localized[1]==='ar'&&indexablePaths.has(source))return context.redirect(source+context.url.search,301);
    if(localized[1]==='es'&&translatedPaths.has(source)){
      const target=new URL(context.url);target.pathname=source;
      response=await next(target);
      if(response.status===200&&response.headers.get('content-type')?.includes('text/html')){
        const headers=new Headers(response.headers);headers.delete('content-length');headers.set('Content-Language','es');
        response=new Response(localizeHtml(await response.text(),source),{status:response.status,headers});
      }
    }else response=await next();
  }else response=await next();
  if(!publicSiteReady(context.site)||utilityPaths.includes(source)||response.status>=400)response.headers.set('X-Robots-Tag','noindex, follow');
  return response;
});
