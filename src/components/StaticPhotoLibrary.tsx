import { useState } from 'react';

type SamplePhoto = { id: string; series: string; label: string; thumb: string; src: string; originalSrc?: string };
const knownSeries = ['CBB60','CBB61','CBB65','CD60'];
const groups = ['All', ...knownSeries, 'Additional samples'];
const displaySeries = (group: string) => group === 'Additional samples' ? 'Other / unidentified samples' : group;

export default function SamplePhotoLibrary({ photographs, series }: { photographs: SamplePhoto[]; series?: string }) {
  const [filter,setFilter] = useState(series || 'All');
  const [limit,setLimit] = useState(8);
  const items = photographs.filter(p => filter === 'All' || p.series === filter);
  return <div className="sample-library">
    {!series && <div className="sample-library-filters" role="group" aria-label="Filter sample photographs">{groups.map(group => <button type="button" key={group} aria-pressed={filter === group} onClick={() => { setFilter(group); setLimit(8); }}>{displaySeries(group)}<span>{group === 'All' ? photographs.length : photographs.filter(x => x.series === group).length}</span></button>)}</div>}
    <p className="sample-library-reference-note">Quote the P photo reference alongside your required rating and connection details. Ask for the proposed model and availability in the quotation.</p>
    <div className="sample-library-grid">{items.slice(0,limit).map(photo => <figure key={photo.id}>
      <img src={photo.thumb} alt={photo.label} width="640" height="640" loading="lazy" decoding="async" />
      <figcaption><strong>{photo.id}</strong><span>{displaySeries(photo.series)}</span><span>{photo.label}</span></figcaption>
    </figure>)}</div>
    <div className="sample-library-footer"><p aria-live="polite">Showing {Math.min(limit,items.length)} of {items.length} photographs</p>{limit < items.length && <button type="button" className="button secondary" onClick={() => setLimit(n => n + 12)}>Show more photographs</button>}</div>
  </div>;
}
