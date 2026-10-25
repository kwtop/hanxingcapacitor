import { defineMiddleware } from 'astro:middleware';
import { indexablePaths, utilityPaths } from './lib/seoRoutes';
import { publicSiteReady } from './lib/publicSite';
import {localBackendProxy} from './server/localProxy';
export const onRequest = defineMiddleware(async (context, next) => {
  if(import.meta.env.DEV&&(context.url.pathname.startsWith('/api/')||context.url.pathname==='/admin'||context.url.pathname.startsWith('/admin/')))return localBackendProxy(context.request);
  const retired: Record<string, string> = { '/certificates/': '/factory/#model-records', '/case-studies/': '/applications/', '/markets/': '/buying-guide/' };
  const normalized = context.url.pathname.endsWith('/') ? context.url.pathname : context.url.pathname + '/';
  if (retired[normalized]) return context.redirect(retired[normalized], 301);
  const localized = context.url.pathname.match(/^\/(es|ar)(\/.*)?$/);
  if (localized) {
    const raw = localized[2] || '/';
    const path = raw.endsWith('/') ? raw : raw + '/';
    if (path === '/request-a-quote/') return context.redirect('/contact/' + context.url.search, 301);
    if (retired[path]) return context.redirect(retired[path], 301);
    if (indexablePaths.has(path)) return context.redirect(path + context.url.search, 301);
    // Never turn an unrelated retired URL into a soft-404 homepage redirect.
  }
  const response = await next();
  if (!publicSiteReady(context.site) || utilityPaths.includes(context.url.pathname) || response.status >= 400) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return response;
});
