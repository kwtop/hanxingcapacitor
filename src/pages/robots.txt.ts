import type { APIRoute } from 'astro';
import { publicSiteReady } from '../lib/publicSite';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const publicUrl = publicSiteReady(site);
  // Wildcard includes Googlebot, Bingbot and OAI-SearchBot. Utility pages must be
  // crawlable so bots can read their noindex; private APIs and studies stay excluded.
  const body = publicUrl ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /home-directions-20261010/\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n` : 'User-agent: *\nDisallow: /\n';
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
};
