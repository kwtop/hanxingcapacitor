import type { APIRoute } from 'astro';
import { indexablePages } from '../lib/seoRoutes';
import { publicSiteReady } from '../lib/publicSite';
import { products, PUBLIC_BRAND_NAME, PUBLIC_COMPANY_NAME, PUBLIC_HEADQUARTERS_ADDRESS, PUBLIC_FACTORY_ADDRESS, PUBLIC_COMPANY_RELATIONSHIP, PUBLIC_OFFICE_MOBILE, PUBLIC_OFFICE_PHONE, PUBLIC_EMAIL, PUBLIC_PHONE } from '../data/site';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const text = (value: string) => value.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const sections: [string, (path: string) => boolean][] = [
    ['Products and sample photographs', path => path.startsWith('/products/')],
    ['Technical guides', path => path.startsWith('/resources/')],
    ['Applications', path => path.startsWith('/applications/')],
    ['OEM, manufacturing and packing', path => /^\/(?:oem(?:-quality)?|factory)(?:\/|$)/.test(path)],
    ['Company, buying and contact', path => !/^\/(?:products|resources|applications|oem(?:-quality)?|factory)(?:\/|$)/.test(path)],
  ];
  const links = sections.map(([heading, includes]) => `## ${heading}\n\n${indexablePages.filter(page => includes(page.path)).map(page => `- [${text(page.title)}](${new URL(page.path, site)}): ${text(page.description)}`).join('\n')}`).join('\n\n');
  const body = publicSiteReady(site) ? `# Hanxing Capacitor\n\n> HAN XING supplies motor run and start capacitors for pumps, fans, HVAC and other single-phase motor equipment. This index links to the English product catalogue, technical guides and company information.\n\n## Company and contact\n\n- Brand: ${PUBLIC_BRAND_NAME}\n- Head company: ${PUBLIC_COMPANY_NAME}\n- Relationship: ${PUBLIC_COMPANY_RELATIONSHIP}\n- Headquarters — Hangzhou: ${PUBLIC_HEADQUARTERS_ADDRESS}\n- Manufacturing facility — Hebei: ${PUBLIC_FACTORY_ADDRESS}\n- Headquarters phones: ${PUBLIC_OFFICE_MOBILE} / ${PUBLIC_OFFICE_PHONE}\n- Website: ${new URL('/', site)}\n- Email: ${PUBLIC_EMAIL}\n- WhatsApp: ${PUBLIC_PHONE}\n- Page sitemap: ${new URL('/sitemap.xml', site)}\n- Image sitemap: ${new URL('/sitemap-images.xml', site)}\n\n## Product series\n\n${products.map(product => `- ${product.code}: ${product.tagline} Published capacitance range: ${product.capacitance}. Rated voltage range: ${product.voltage}.`).join('\n')}\n\nThese are catalogue series ranges, not a list of every available rating and case combination. Electrical ratings, dimensions, connections and starting-duty limits belong to the selected model. The technical guides distinguish general selection principles from photographed sample values. OEM services cover labels and packaging; electrical and structural changes are quoted by model.\n\n## Reading pages as Markdown\n\nThe public English and Spanish page URLs support HTTP content negotiation. Send \`Accept: text/markdown\` to receive the main content of that page as Markdown, including its tables and links. Requests without an explicit Markdown preference receive HTML. The page sitemap lists the supported public URLs.\n\n${links}\n` : '# Hanxing Capacitor\n\nThis is a non-indexable preview. The public content index is available only in an approved public build.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', ...(!publicSiteReady(site) ? { 'X-Robots-Tag': 'noindex' } : {}) } });
};
