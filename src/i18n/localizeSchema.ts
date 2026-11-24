type LocalizationOptions = {
  sourcePath: string;
  modifiedAt: string | undefined;
  translatedPaths: ReadonlySet<string>;
  translate: (value: string) => string;
};

export const readableKeys = new Set(['name', 'headline', 'description', 'abstract', 'text', 'caption', 'category', 'contactType', 'value', 'imageAlt', 'alt', 'label', 'summary', 'intro', 'tagline', 'note', 'title', 'prompt', 'answer', 'question', 'body', 'shortName', 'seriesDescription']);
const contentTypes = new Set(['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'FAQPage', 'ImageGallery', 'TechArticle']);
const sharedTypes = new Set(['Organization', 'Brand', 'WebSite']);
const sharedIds = new Set(['#organization', '#brand', '#website', '#manufacturing-facility']);

/** Localize content nodes while retaining the identity of shared entities. */
export function localizeSchema(value: unknown, options: LocalizationOptions): unknown {
  function visit(value: unknown, key = '', parentType = ''): unknown {
    if (key === 'inLanguage') return parentType === 'WebSite' ? ['en', 'es'] : 'es';
    if (typeof value === 'string') {
      if (['@id', 'url', 'item', 'mainEntityOfPage', 'citation'].includes(key)) {
        const url = new URL(value, 'https://www.hanxingcapacitor.com');
        if (url.pathname === '/' && sharedIds.has(url.hash)) return value;
        if (url.origin === 'https://www.hanxingcapacitor.com' && options.translatedPaths.has(url.pathname)) {
          return url.origin + '/es' + url.pathname + url.search + url.hash;
        }
        return value;
      }
      if (sharedTypes.has(parentType) && key === 'name') return value;
      return readableKeys.has(key) ? options.translate(value) : value;
    }
    if (Array.isArray(value)) return value.map(item => visit(item, key, parentType));
    if (value && typeof value === 'object') {
      const object = value as Record<string, unknown>;
      const types = Array.isArray(object['@type']) ? object['@type'] : [object['@type']];
      const type = typeof types[0] === 'string' ? types[0] : parentType;
      const result = Object.fromEntries(Object.entries(object).map(([name, item]) => [name,
        sharedTypes.has(type) && name === 'url' ? item : visit(item, name, type),
      ]));
      // An @id-only publisher/author reference is not an article. Inherited
      // context is used for translating text, never to assign editorial dates.
      if (types.some(type => typeof type === 'string' && contentTypes.has(type)) && options.modifiedAt) {
        result.dateModified = options.modifiedAt;
      }
      return result;
    }
    return value;
  }
  return visit(value);
}
