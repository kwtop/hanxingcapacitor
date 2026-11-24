import type { APIRoute } from 'astro';
import { indexablePages, xmlEscape } from '../lib/seoRoutes';
import { publicSiteReady } from '../lib/publicSite';
import { contentModifiedAt } from '../data/contentRevisions';
import esMetadata from '../i18n/es-metadata.json';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const pages = publicSiteReady(site) ? indexablePages : [];
  // Dates come from actual editorial changes, never from the build clock.
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.flatMap(page=>['en','es'].map(lang=>{
    const path=lang==='es'?'/es'+page.path:page.path;
    const modified=lang==='es'?(esMetadata.pageModifiedAt as Record<string,string>)[page.path]||esMetadata.modifiedAt:contentModifiedAt[page.path];
    return `<url><loc>${xmlEscape(new URL(path,site).toString())}</loc>${modified?`<lastmod>${xmlEscape(modified)}</lastmod>`:''}${['en','es','x-default'].map(code=>`<xhtml:link rel="alternate" hreflang="${code}" href="${xmlEscape(new URL(code==='es'?'/es'+page.path:page.path,site).href)}"/>`).join('')}</url>`;
  })).join('')}</urlset>`;
  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
