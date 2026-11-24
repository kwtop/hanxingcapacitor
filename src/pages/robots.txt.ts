import type { APIRoute } from 'astro';
import { publicSiteReady } from '../lib/publicSite';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const publicUrl = publicSiteReady(site);
  // Public crawling is open to every user agent. Private data is protected by
  // authentication, not robots.txt; utility pages retain their own noindex.
  const body = publicUrl ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n` : 'User-agent: *\nDisallow: /\n';
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
};
