import type { APIRoute } from 'astro';
import { indexablePages, xmlEscape } from '../lib/seoRoutes';
import { publicSiteReady } from '../lib/publicSite';
import { pageSeo } from '../lib/pageSeo';

export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const pages = publicSiteReady(site) ? indexablePages : [];
  // Reuse each page's actual social/structured-data image. No invented captions,
  // image URLs, update dates or private pages are added to the crawler index.
  const entries = pages.flatMap(page => {
    const canonical = new URL(page.path, site).toString();
    const { image } = pageSeo(page.path, page.title, page.description, canonical);
    return [page.path,'/es'+page.path].map(path=>`<url><loc>${xmlEscape(new URL(path,site).href)}</loc><image:image><image:loc>${xmlEscape(image)}</image:loc></image:image></url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
