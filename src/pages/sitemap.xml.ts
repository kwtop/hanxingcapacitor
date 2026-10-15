import type { APIRoute } from 'astro';
import { indexablePages, xmlEscape } from '../lib/seoRoutes';
import { publicSiteReady } from '../lib/publicSite';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const pages = publicSiteReady(site) ? indexablePages : [];
  // No lastmod is preferable to fabricated deploy timestamps.
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page=>`<url><loc>${xmlEscape(new URL(page.path,site).toString())}</loc></url>`).join('')}</urlset>`;
  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
