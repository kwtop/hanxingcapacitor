import { useRef } from 'react';
import { useCatalogQuery, type CatalogQuery } from '../lib/catalogQuery';
import ImageWithFeedback from './ImageWithFeedback';

type Item = { code:string; slug:string; shortName:string; tagline:string; image:string; imageAlt:string; function:'Run'|'Start'; capacitance:string; voltage:string };
const compactPurposes: Record<string, string> = {
  CBB60: 'Water pumps & single-phase motors',
  CBB61: 'Fans, blowers & appliance motors',
  CBB65: 'HVAC & refrigeration',
  CD60: 'Switched single-phase circuits',
};
const duties = ['All', 'Run', 'Start'] as const;

export default function ProductFilter({ items, compact = false, initial = { selection: 'All', query: '' } }: { items: Item[]; compact?: boolean; initial?: CatalogQuery }) {
  const [filters, update] = useCatalogQuery(initial, 'duty', duties);
  const search = useRef<HTMLInputElement>(null);
  const query = filters.query.trim().toLowerCase();
  const visibleItems = items.filter(item => (filters.selection === 'All' || item.function === filters.selection) &&
    `${item.code} ${item.shortName} ${item.tagline} ${item.capacitance} ${item.voltage}`.toLowerCase().includes(query));
  return <>
    <div className="catalog-controls"><div className="filter-row" role="group" aria-label="Filter products by duty">{duties.map(label => <button key={label} className={'filter-chip ' + (filters.selection === label ? 'active' : '')} type="button" aria-pressed={filters.selection === label} onClick={() => update({ ...filters, selection: label }, true)}>{label === 'All' ? 'All series' : label + ' duty'}</button>)}</div>
    <label className="catalog-query-field"><span>Search by series code or keyword</span><input ref={search} type="search" value={filters.query} maxLength={120} placeholder="e.g. CBB65 or fan" onChange={event => update({ ...filters, query: event.target.value })} /></label></div>
    <p className="catalog-query-count" role="status" aria-live="polite">{visibleItems.length} series shown</p>
    {visibleItems.length === 0 && <div className="catalog-empty"><h2>No matching series</h2><p>Try a series code or keyword, such as CBB60 or fan. For a specific capacitance, compare the series ranges below or <a href="/contact/">send your requirements</a>.</p><button className="button secondary" type="button" onClick={() => { update({ selection: 'All', query: '' }, true); search.current?.focus(); }}>Clear filters</button></div>}
    <div className={'grid four series-catalog' + (compact ? ' series-catalog-compact' : '')}>{visibleItems.map(p => <article className="card product-card" key={p.code}>
      <a className={'image-frame catalog-product-image sample-catalog-image sample-' + p.code} href={'/products/' + p.slug + '/'} aria-label={'View ' + p.code + ' details'}><ImageWithFeedback src={p.image} alt={p.imageAlt} width={2000} height={2000} sizes="(max-width: 600px) calc((100vw - 64px) / 2), (max-width: 1199px) calc((100vw - 80px) / 2), 330px" retryable={false} errorActionLabel="Open series details to view photographs." /></a>
      <div className="card-body">
        {compact ? <div className="catalog-series-title"><h2 className="card-title"><a href={'/products/' + p.slug + '/'}>{p.code}</a></h2><span className="catalog-series-duty">{p.shortName}</span></div>
          : <><p className="catalog-duty">{p.function} duty</p><h2 className="card-title"><a href={'/products/' + p.slug + '/'}>{p.code}<span className="series-name">{p.shortName} capacitor</span></a></h2></>}
        <p className="catalog-purpose">{compact ? compactPurposes[p.code] ?? p.tagline : p.tagline}</p>
        <dl className="catalog-ratings" aria-label={`${p.code} published series ranges`}>{p.code === 'CBB65' ? <>
          <div className={compact ? 'catalog-rating-group' : undefined}><dt>{compact ? 'Single' : 'Single run'}</dt><dd><span>2–100 µF</span><span className={compact ? 'catalog-voltage' : undefined}>110–450 VAC</span></dd></div>
          <div className={compact ? 'catalog-rating-group' : undefined}><dt>{compact ? 'Dual' : 'Dual run'}</dt><dd><span>{compact ? <>1+15 to <span className="catalog-no-break">15+80 µF</span></> : '1+15 to 15+80 µF'}</span><span className={compact ? 'catalog-voltage' : undefined}>370–450 VAC</span></dd></div>
        </> : <>
          <div><dt className={compact ? 'visually-hidden' : undefined}>Capacitance</dt><dd>{p.capacitance}</dd></div>
          <div><dt className={compact ? 'visually-hidden' : undefined}>AC voltage</dt><dd className={compact ? 'catalog-voltage' : undefined}>{p.voltage}</dd></div>
        </>}</dl>
        <a className={compact ? 'catalog-series-link' : 'card-link'} href={'/products/' + p.slug + '/'} aria-label={compact ? `View ${p.code} details` : undefined}>{compact ? 'View details' : `View ${p.code} details`}</a>
      </div>
    </article>)}</div>
  </>;
}
