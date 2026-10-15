import { applications, products } from '../data/site';
import { guides } from '../data/guides';

export const utilityPaths = ['/404/', '/thank-you/', '/request-a-quote/', '/typography-preview/'];
const pages = import.meta.glob('../pages/**/*.astro', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const attribute = (source: string, name: string) => source.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || '';
const staticPages = Object.entries(pages).flatMap(([file, source]) => {
  if (file.includes('[')) return [];
  const path = '/' + file.replace('../pages/', '').replace(/(?:^|\/)index\.astro$/, '').replace(/\.astro$/, '').replace(/\/$/, '');
  const normalized = path === '/' ? '/' : path + '/';
  const layout = source.match(/<BaseLayout\b[^>]*>/)?.[0];
  if (!layout || utilityPaths.includes(normalized) || /\bnoindex(?:\s|=|>)/.test(layout)) return [];
  return [{ path: normalized, title: attribute(layout, 'title'), description: attribute(layout, 'description') }];
});

/** Sources and real content collections, shared by sitemap, llms and migration redirects. */
export const indexablePages = [...new Map([
  ...staticPages,
  ...products.map(p => ({ path: `/products/${p.slug}/`, title: p.title, description: p.tagline })),
  ...applications.map(a => ({ path: `/applications/${a.slug}/`, title: a.title, description: a.intro })),
  ...guides.map(g => ({ path: `/resources/${g.slug}/`, title: g.title, description: g.summary })),
].map(page => [page.path, page])).values()].sort((a, b) => a.path.localeCompare(b.path));
export const indexablePaths = new Set(indexablePages.map(page => page.path));
export const xmlEscape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
