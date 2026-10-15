import { guides } from '../data/guides';
const sections: Record<string, string> = { products: 'Products', applications: 'Applications', resources: 'Resources' };
const procurement: Record<string, string> = { '/oem/': 'OEM & private label', '/factory/': 'Manufacturing & quality', '/factory/packing-and-dispatch/': 'Packing & dispatch' };
export function pageBreadcrumbs(path: string, title: string, canonical: string) {
  if (path === '/') return null;
  const base = new URL(canonical);
  const entries = [{ name: 'Home', path: '/' }];
  const first = path.split('/')[1];
  if (sections[first] && path !== `/${first}/`) entries.push({ name: sections[first], path: `/${first}/` });
  if (['/buying-guide/', '/faq/'].includes(path)) entries.push({ name: 'Resources', path: '/resources/' });
  const guide = guides.find(g => path === `/resources/${g.slug}/`);
  if (guide) entries.push(guide.slug === 'motor-capacitor-order-shipment-checklist' ? { name: 'Buying & shipping', path: '/buying-guide/' } : { name: 'Technical guides', path: '/resources/articles/' });
  if (procurement[path]) entries.push({ name: 'OEM & quality', path: '/oem-quality/' });
  if (path === '/factory/packing-and-dispatch/') entries.push({ name: 'Manufacturing & quality', path: '/factory/' });
  entries.push({ name: ({ '/resources/articles/': 'Technical guides', '/buying-guide/': 'Buying & shipping', '/faq/': 'Buyer FAQ' } as Record<string,string>)[path] || procurement[path] || title.split(' | ')[0], path });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, name: entry.name, item: new URL(entry.path, base).toString() })) };
}
