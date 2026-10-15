import type { APIRoute } from 'astro';
import { indexablePages } from '../lib/seoRoutes';
import { publicSiteReady } from '../lib/publicSite';
import { PUBLIC_COMPANY_NAME, PUBLIC_EMAIL, PUBLIC_PHONE } from '../data/site';
export const prerender = false;
export const GET: APIRoute = ({ site }) => {
  const body = publicSiteReady(site) ? `# Hanxing Capacitor\n\n> Motor run and start capacitors for equipment sourcing. This index links to series specifications, selection guides, company information and inquiry options. Availability and certification need separate model-specific documents.\n\n## Contact\n\n- Business contact: ${PUBLIC_COMPANY_NAME}\n- Email: ${PUBLIC_EMAIL}\n- WhatsApp: ${PUBLIC_PHONE}\n\n## Product information\n\nCBB60, CBB61 and CBB65 are run series; CD60 is a start series. Series ranges describe overall limits. Use the model datasheet and drawing to check ratings, dimensions, wiring and duty, and ask about availability of the configuration required. Sample markings apply to the photographed part. Studio and application visuals are illustrative. The contact form creates a draft for the visitor to send through email or WhatsApp. Legal seller and manufacturer identity, their relationship to the brand, and certificate coverage must be confirmed for an order.\n\n## Pages\n\n${indexablePages.map(page => `- [${page.title.replace(/&amp;/g, '&')}](${new URL(page.path, site)}): ${page.description.replace(/&amp;/g, '&')}`).join('\n')}\n` : '# Hanxing Capacitor\n\nThis is a non-indexable preview. The public content index is available only in an approved public build.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', ...(!publicSiteReady(site) ? { 'X-Robots-Tag': 'noindex' } : {}) } });
};
