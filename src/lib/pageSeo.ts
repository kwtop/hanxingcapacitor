import { applications, products, resourceSections, PUBLIC_BRAND_NAME, PUBLIC_COMPANY_NAME, PUBLIC_COMPANY_RELATIONSHIP, PUBLIC_EMAIL, PUBLIC_PHONE, SITE_NAME } from '../data/site';
import { companyProfile } from '../data/company';
import { displayImageUrl } from '../data/imageDelivery';
import { aboutHeroFilm } from '../data/aboutHeroFilm';
import { contentModifiedAt } from '../data/contentRevisions';
import { guides } from '../data/guides';
import { buyerQuestions } from '../data/buyerQuestions';
import oemPhotography from '../data/oemPhotography.generated.json';
import {interiorPhotography} from '../data/interiorPhotography';
import {sourcePhotography} from '../data/sourcePhotography';
import { oemProcessGallery } from '../data/oemWorkshopPhotography';
import {resourceGuidePhotography,resourcePhotography} from '../data/resourcePhotography';
import { comparisonPhotography } from '../data/comparisonPhotography';

export function pageSeo(path: string, title: string, description: string, canonical: string) {
  const base = new URL(canonical);
  const absolute = (value: string) => new URL(value, base).toString();
  const organizationId = absolute('/#organization');
  const brandId = absolute('/#brand');
  const websiteId = absolute('/#website');
  const product = products.find(p => path === `/products/${p.slug}/`);
  const application = applications.find(a => path === `/applications/${a.slug}/`);
  const guide = guides.find(g => path === `/resources/${g.slug}/`);
  const gallery = path === '/factory/process-gallery/';
  const resourceImage = guide && resourceGuidePhotography[guide.slug]
    || (path === '/resources/' ? interiorPhotography.technical : path === '/resources/articles/' ? resourcePhotography.label : undefined);
  const editorialImage = path === '/about/' ? { src: aboutHeroFilm.poster, alt: aboutHeroFilm.posterAlt } : resourceImage || (path === '/oem-quality/' || path === '/oem/' || guide?.slug === 'oem-capacitor-sample-approval' ? oemPhotography['oem-lineup']
    : path === '/factory/' ? interiorPhotography['factory-scene']
    : path === '/factory/packing-and-dispatch/' ? oemPhotography['packing-clearance']
    : gallery ? sourcePhotography['film-floor'] : undefined);
  const productPresentation = product?.code === 'CD60' ? comparisonPhotography.CD60 : undefined;
  const image = displayImageUrl(productPresentation?.src || product?.image || application?.image || editorialImage?.src || '/images/real/batch-products.jpg');
  const imageAlt = productPresentation?.alt || product?.imageAlt || application?.imageAlt || editorialImage?.alt || 'HAN XING capacitor samples.';
  const pageType = path === '/about/' ? 'AboutPage' : path === '/contact/' ? 'ContactPage'
    : gallery ? 'ImageGallery'
    : product || ['/products/', '/applications/', '/resources/', '/resources/articles/', '/products/photographs/', '/oem-quality/'].includes(path) ? 'CollectionPage' : 'WebPage';
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organizationId, name: PUBLIC_COMPANY_NAME, brand: { '@id': brandId },
      url: absolute('/'), email: PUBLIC_EMAIL, telephone: PUBLIC_PHONE,
      description: PUBLIC_COMPANY_RELATIONSHIP,
      foundingDate: String(companyProfile.founded),
      address: { '@type': 'PostalAddress', ...companyProfile.headquarters.postalAddress },
      location: { '@id': absolute('/#manufacturing-facility') },
      contactPoint: { '@type': 'ContactPoint', contactType: 'Sales inquiries', email: PUBLIC_EMAIL,
        telephone: [PUBLIC_PHONE, companyProfile.contact.officeMobile, companyProfile.contact.officePhone] } },
    { '@type': 'WebSite', '@id': websiteId, url: absolute('/'), name: SITE_NAME, inLanguage: ['en','es'], publisher: { '@id': organizationId } },
    { '@type': pageType, '@id': canonical + '#webpage', url: canonical, name: title, description,
      inLanguage: 'en', isPartOf: { '@id': websiteId }, publisher: { '@id': organizationId },
      ...(contentModifiedAt[path] ? { dateModified: contentModifiedAt[path] } : {}) },
  ];
  graph.push({ '@type': 'Brand', '@id': brandId, name: PUBLIC_BRAND_NAME, alternateName: SITE_NAME, logo: absolute(companyProfile.brand.logo), sameAs: companyProfile.socialProfiles.map(profile => profile.url) });
  graph.push({ '@type': 'Place', '@id': absolute('/#manufacturing-facility'), name: 'HAN XING manufacturing facility — Hebei',
    address: { '@type': 'PostalAddress', ...companyProfile.manufacturing.postalAddress } });
  const oemPageNames:Record<string,string>={
    '/oem/':'OEM','/factory/':'Manufacturing','/factory/process-gallery/':'Process gallery','/factory/packing-and-dispatch/':'Packing & dispatch',
  };
  if(path==='/oem-quality/'||oemPageNames[path]){
    const trail=[{name:'Home',href:'/'},{name:'OEM & quality',href:'/oem-quality/'}];
    if(gallery)trail.push({name:'Manufacturing',href:'/factory/'});
    if(oemPageNames[path])trail.push({name:oemPageNames[path],href:path});
    graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumbs',itemListElement:trail.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absolute(item.href)}))});
    graph[2].breadcrumb={'@id':canonical+'#breadcrumbs'};
  }
  if (product) {
    // These quote-only family catalogues do not publish SKU offers or reviews.
    // ProductGroup is a Product subtype, so it is not a workaround for Google's
    // product-snippet requirements. Keep the factual topic without targeting it.
    graph[2].about = { '@type': 'Thing', '@id': canonical + '#series',
      identifier: product.code, name: product.title, description: product.intro,
      url: canonical, image: absolute(image) };
  }
  if (guide) {
    graph.push({ '@type': 'TechArticle', '@id': canonical + '#article', headline: guide.title,
      description: guide.summary, abstract: guide.answer, url: canonical, inLanguage: 'en',
      publisher: { '@id': organizationId }, mainEntityOfPage: { '@id': canonical + '#webpage' },
      ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
      ...(guide.author ? { author: { '@type': guide.author.type, name: guide.author.name,
        ...(guide.author.url ? { url: absolute(guide.author.url) } : {}) } } : {}),
      ...(contentModifiedAt[path] ? { dateModified: contentModifiedAt[path] } : {}),
      citation: guide.sources.map(source => absolute(source.href)), image: absolute(image) });
    graph[2].mainEntity = { '@id': canonical + '#article' };
  }
  if (path === '/faq/') {
    // Keep the machine-readable answers identical to the visible FAQ.
    graph[2]['@type'] = 'FAQPage';
    graph[2].mainEntity = buyerQuestions.map(({ question, answer }) => ({
      '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }));
  }
  const items = path === '/products/' ? products.map(p => ({ name: p.title, path: `/products/${p.slug}/` }))
    : path === '/applications/' ? applications.map(a => ({ name: a.shortName, path: `/applications/${a.slug}/` }))
    : path === '/resources/' ? resourceSections.map(section => ({ name: section.label, path: section.href }))
    : path === '/resources/articles/' ? guides.filter(g => g.slug !== 'motor-capacitor-order-shipment-checklist').map(g => ({ name: g.title, path: `/resources/${g.slug}/` })) : [];
  if (items.length) graph[2].mainEntity = { '@type': 'ItemList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: absolute(item.path) })) };
  if (path === '/oem-quality/') graph[2].mainEntity = { '@type':'ItemList', itemListElement: [
    ['OEM and private label','/oem/'],['Manufacturing and quality','/factory/'],['Workshop process gallery','/factory/process-gallery/'],['Packing and dispatch','/factory/packing-and-dispatch/'],
  ].map(([name,url],index)=>({'@type':'ListItem',position:index+1,name,url:absolute(url)})) };
  if (gallery) {
    graph[2].associatedMedia = oemProcessGallery
      .filter(chapter => chapter.id !== 'dispatch')
      .flatMap(chapter => chapter.photos.map(photo => ({
        '@type': 'ImageObject',
        contentUrl: absolute(photo.fullSrc),
        caption: photo.caption,
        description: photo.alt,
      })));
  }
  return { image: absolute(image), imageAlt, ogType: guide ? 'article' : 'website', schema: { '@context': 'https://schema.org', '@graph': graph } };
}
