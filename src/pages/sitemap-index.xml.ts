import type { APIRoute } from 'astro';
import { publicSiteReady } from '../lib/publicSite';
import { xmlEscape } from '../lib/seoRoutes';
export const prerender = false;
export const GET: APIRoute = ({ site }) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicSiteReady(site) ? ['/sitemap.xml', '/sitemap-images.xml'].map(path => `<sitemap><loc>${xmlEscape(new URL(path, site).toString())}</loc></sitemap>`).join('') : ''}</sitemapindex>`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
