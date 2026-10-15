import type { Product } from '../data/site';

export default function ProductRail({ products }: { products: Product[] }) {
  return <>
    <div className="section-head home-catalog-head">
      <div><h2>Find your capacitor</h2></div>
    </div>
    <div className="product-rail" aria-label="Motor capacitor series">
      {products.map(p => <article className="rail-product" key={p.code}>
        <a className={`rail-image catalog-product-image sample-catalog-image home-sample-${p.code.toLowerCase()} sample-${p.code}`} href={`/products/${p.slug}/`}>
          <img src={p.image} alt={p.imageAlt} loading="lazy" />
        </a>
        <div className="rail-product-title"><h3><a href={`/products/${p.slug}/`}>{p.code}</a></h3><span>{p.shortName}</span></div>
        <dl className="home-ratings">
          <div><dt>Capacitance</dt><dd>{p.code === 'CBB65' ? '2–100 µF (single)' : p.capacitance}</dd></div><div><dt>Rated voltage</dt><dd>{p.code === 'CBB65' ? '110–450 VAC (single)' : p.voltage}</dd></div>{p.code === 'CBB65' && <div><dt>Other format</dt><dd>Dual-run: see details</dd></div>}
        </dl>
      </article>)}
    </div>
  </>;
}
