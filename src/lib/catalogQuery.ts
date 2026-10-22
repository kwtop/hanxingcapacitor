import { useEffect, useState } from 'react';

export type CatalogQuery = { selection: string; query: string };

export function readCatalogQuery(params: URLSearchParams, parameter: string, choices: readonly string[]): CatalogQuery {
  const candidate = params.get(parameter) || 'All';
  return { selection: choices.includes(candidate) ? candidate : 'All', query: (params.get('q') || '').slice(0, 120) };
}

/** Search replaces the current entry; changing a category also supports browser Back. */
export function useCatalogQuery(initial: CatalogQuery, parameter: string, choices: readonly string[]) {
  const [filters, setFilters] = useState(initial);
  useEffect(() => {
    const restore = () => setFilters(readCatalogQuery(new URLSearchParams(location.search), parameter, choices));
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [parameter, choices]);

  function update(next: CatalogQuery, categoryChange = false) {
    setFilters(next);
    const url = new URL(location.href);
    if (next.selection === 'All') url.searchParams.delete(parameter);
    else url.searchParams.set(parameter, next.selection);
    if (next.query) url.searchParams.set('q', next.query);
    else url.searchParams.delete('q');
    if (url.href !== location.href) {
      window.history[categoryChange ? 'pushState' : 'replaceState'](null, '', url);
    }
  }
  return [filters, update] as const;
}
