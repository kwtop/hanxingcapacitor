import { useEffect, useRef, useState } from 'react';
import { useCatalogQuery, type CatalogQuery } from '../lib/catalogQuery';
import ImageWithFeedback from './ImageWithFeedback';
import PhotoViewer from './PhotoViewer';

type SamplePhoto = { id: string; series: string; label: string; thumb: string; src: string; originalSrc?: string };
const knownSeries = ['CBB60','CBB61','CBB65','CD60'];
const groups = ['All', ...knownSeries, 'Additional samples'];
const displaySeries = (group: string) => group === 'Additional samples' ? 'Other / unidentified samples' : group;

export default function SamplePhotoLibrary({ photographs, series, initial = { selection: 'All', query: '' }, previewState }: { photographs: SamplePhoto[]; series?: string; initial?: CatalogQuery; previewState?: 'loading' | 'error' }) {
  const [filters, update] = useCatalogQuery(initial, 'series', groups);
  const [limit,setLimit] = useState(8);
  const [active, setActive] = useState<number | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const focusNext = useRef<number | null>(null);
  const filter = series || filters.selection;
  const query = filters.query.trim().toLowerCase();
  const items = photographs.filter(p => (filter === 'All' || p.series === filter) && `${p.id} ${p.series} ${p.label}`.toLowerCase().includes(query));
  useEffect(() => { setLimit(8); setActive(null); }, [filters.selection, filters.query]);
  useEffect(() => {
    if (focusNext.current !== null) { grid.current?.querySelectorAll<HTMLButtonElement>('.sample-photo-open')[focusNext.current]?.focus(); focusNext.current = null; }
  }, [limit]);
  const viewerPhotos = items.map(photo => ({ ...photo, src: photo.originalSrc || photo.src, note: 'Original supplied sample photograph. A P reference identifies the photograph, not an approved model or stock item.', inquiryHref: `/contact/?${knownSeries.includes(photo.series) ? 'series=' + photo.series + '&' : ''}photo=${encodeURIComponent(photo.id)}` }));
  return <div className="sample-library">
    {!series && <div className="sample-library-filters" role="group" aria-label="Filter sample photographs">{groups.map(group => <button type="button" key={group} aria-pressed={filter === group} onClick={() => update({ ...filters, selection: group }, true)}>{displaySeries(group)}<span>{group === 'All' ? photographs.length : photographs.filter(x => x.series === group).length}</span></button>)}</div>}
    <div className="catalog-query-toolbar"><label className="catalog-query-field"><span>Search photograph reference or label</span><input ref={search} type="search" value={filters.query} maxLength={120} placeholder="e.g. P034 or CBB65" onChange={event => update({ ...filters, query: event.target.value })} /></label><p className="catalog-query-count" role="status">{items.length} photographs found</p></div>
    <p className="sample-library-reference-note">Include the photograph reference, required rating and connection details in your inquiry.</p>
    {items.length === 0 && <div className="catalog-empty"><h2>No matching photographs</h2><p>Try a P reference, choose another series, or clear the filters.</p><button type="button" className="button secondary" onClick={() => { update({ selection: 'All', query: '' }, true); search.current?.focus(); }}>Clear filters</button></div>}
    <div ref={grid} className="sample-library-grid">{items.slice(0,limit).map((photo, index) => <figure key={photo.id}>
      <button className="sample-photo-open" type="button" aria-label={`View photograph ${photo.id}: ${photo.label}`} onClick={() => setActive(index)}><ImageWithFeedback key={photo.src} src={photo.thumb} alt={photo.label} width={640} height={640} loading="lazy" retryable={false} previewState={index === 0 ? previewState : undefined} /></button>
      <figcaption><strong>{photo.id}</strong><span>{displaySeries(photo.series)}</span><span>{photo.label}</span></figcaption>
    </figure>)}</div>
    <div className="sample-library-footer"><p aria-live="polite">Showing {Math.min(limit,items.length)} of {items.length} photographs</p>{limit < items.length && <button type="button" className="button secondary" onClick={() => { focusNext.current = limit; setLimit(n => n + 12); }}>Show more photographs</button>}</div>
    <PhotoViewer photos={viewerPhotos} active={active} onSelect={setActive} onClose={() => setActive(null)} previewState={previewState} />
  </div>;
}
