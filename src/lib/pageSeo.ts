import { applications, products, resourceSections, PUBLIC_BUSINESS_ADDRESS, PUBLIC_COMPANY_NAME, PUBLIC_EMAIL, PUBLIC_PHONE, SITE_NAME } from '../data/site';
import { guides } from '../data/guides';

export function pageSeo(path: string, title: string, description: string, canonical: string) {
  const base = new URL(canonical);
  const absolute = (value: string) => new URL(value, base).toString();
  const organizationId = absolute('/#organization');
  const websiteId = absolute('/#website');
  const product = products.find(p => path === `/products/${p.slug}/`);
  const application = applications.find(a => path === `/applications/${a.slug}/`);
  const guide = guides.find(g => path === `/resources/${g.slug}/`);
  const image = product?.image || application?.image || '/images/real/batch-products.jpg';
  const imageAlt = product?.imageAlt || application?.imageAlt || 'Supplied photograph of Hanxing-marked capacitor samples.';
  const pageType = path === '/about/' ? 'AboutPage' : path === '/contact/' ? 'ContactPage'
    : ['/products/', '/applications/', '/resources/', '/resources/articles/', '/products/photographs/'].includes(path) ? 'CollectionPage' : 'WebPage';
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organizationId, name: PUBLIC_COMPANY_NAME, alternateName: SITE_NAME,
      url: absolute('/'), email: PUBLIC_EMAIL, telephone: PUBLIC_PHONE,
      description: `HAN XING motor run and start capacitor supply. ${PUBLIC_BUSINESS_ADDRESS}` },
    { '@type': 'WebSite', '@id': websiteId, url: absolute('/'), name: SITE_NAME, inLanguage: 'en', publisher: { '@id': organizationId } },
    { '@type': pageType, '@id': canonical + '#webpage', url: canonical, name: title, description,
      inLanguage: 'en', isPartOf: { '@id': websiteId }, publisher: { '@id': organizationId } },
  ];
  if (product) {
    // A series is a product group, not an invented purchasable SKU or offer.
    graph.push({ '@type': 'ProductGroup', '@id': canonical + '#series', name: product.title,
      productGroupID: product.code, url: canonical, description: product.intro, image: absolute(product.image),
      category: `${product.function} motor capacitors`, mainEntityOfPage: { '@id': canonical + '#webpage' },
      additionalProperty: [
        ['Published capacitance range', product.capacitance], ['Published rated voltage range', product.voltage],
        ['Circuit duty', product.function], ['Model selection', 'Select the model against the motor specification and check ratings, connections and dimensions before ordering.'],
      ].map(([name, value]) => ({ '@type': 'PropertyValue', name, value })) });
    graph[2].mainEntity = { '@id': canonical + '#series' };
  }
  if (guide) {
    graph.push({ '@type': 'TechArticle', '@id': canonical + '#article', headline: guide.title,
      description: guide.summary, abstract: guide.answer, url: canonical, inLanguage: 'en',
      publisher: { '@id': organizationId }, mainEntityOfPage: { '@id': canonical + '#webpage' },
      citation: guide.sources.map(source => source.href) });
    graph[2].mainEntity = { '@id': canonical + '#article' };
  }
  const items = path === '/products/' ? products.map(p => ({ name: p.title, path: `/products/${p.slug}/` }))
    : path === '/applications/' ? applications.map(a => ({ name: a.shortName, path: `/applications/${a.slug}/` }))
    : path === '/resources/' ? resourceSections.map(section => ({ name: section.label, path: section.href }))
    : path === '/resources/articles/' ? guides.filter(g => g.slug !== 'motor-capacitor-order-shipment-checklist').map(g => ({ name: g.title, path: `/resources/${g.slug}/` })) : [];
  if (items.length) graph[2].mainEntity = { '@type': 'ItemList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: absolute(item.path) })) };
  return { image: absolute(image), imageAlt, ogType: guide ? 'article' : 'website', schema: { '@context': 'https://schema.org', '@graph': graph } };
}
