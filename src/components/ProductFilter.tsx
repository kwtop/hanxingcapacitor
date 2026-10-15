import { useState } from 'react';

type Item = { code:string; slug:string; shortName:string; tagline:string; image:string; imageAlt:string; function:'Run'|'Start'; capacitance:string; voltage:string };
export default function ProductFilter({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<'All'|'Run'|'Start'>('All');
  const visibleItems = items.filter(item => filter === 'All' || item.function === filter);
  return <>
    <div className="filter-row" role="group" aria-label="Filter products by duty">{(['All','Run','Start'] as const).map(label => <button key={label} className={'filter-chip ' + (filter === label ? 'active' : '')} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label === 'All' ? 'All series' : label + ' duty'}</button>)}</div>
    <p className="visually-hidden" role="status">{visibleItems.length} series shown</p>
    <div className="grid four series-catalog">{visibleItems.map(p => <article className="card product-card" key={p.code}>
      <a className={'image-frame catalog-product-image sample-catalog-image sample-' + p.code} href={'/products/' + p.slug + '/'} aria-label={'View ' + p.code + ' details'}><img src={p.image} alt={p.imageAlt} width="2000" height="2000" /></a>
      <div className="card-body"><p className="catalog-duty">{p.function} duty</p><h2 className="card-title"><a href={'/products/' + p.slug + '/'}>{p.code}<span className="series-name">{p.shortName} capacitor</span></a></h2><p className="catalog-purpose">{p.tagline}</p>
        <dl className="catalog-ratings">{p.code === 'CBB65' ? <><div><dt>Single run</dt><dd><span>2–100 µF</span><span>110–450 VAC</span></dd></div><div><dt>Dual run</dt><dd><span>1+15 to 15+80 µF</span><span>370–450 VAC</span></dd></div></> : <><div><dt>Capacitance</dt><dd>{p.capacitance}</dd></div><div><dt>AC voltage</dt><dd>{p.voltage}</dd></div></>}</dl>
        <a className="card-link" href={'/products/' + p.slug + '/'}>View {p.code} details</a>
      </div>
    </article>)}</div>
  </>;
}
