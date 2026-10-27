import { useState } from 'react';
import { products } from '../data/site';
const rules: Record<string, { title: string; body: string; series: string[] }> = {
  pump: { title: 'Run and start duty for pumps', body: 'Use CBB60 for run duty and CD60 for switched start duty. The pump motor diagram identifies whether it uses one capacitor or both.', series: ['CBB60', 'CD60'] },
  fan: { title: 'Rating and space at the mounting point', body: 'Compare CBB61 rectangular and CBB60 cylindrical run formats. Match the motor rating, original connections and mounting space.', series: ['CBB61', 'CBB60'] },
  appliance: { title: 'Identify the appliance motor', body: 'Compare CBB60 and CBB61 against the appliance motor rating, case, wiring and mounting dimensions.', series: ['CBB60', 'CBB61'] },
  hvac: { title: 'Single, dual-run or separate start', body: 'Use CBB65 for single or dual-run duty. CD60 is for a separately switched starting circuit. Include the motor diagram, µF markings and terminal layout.', series: ['CBB65', 'CD60'] },
  other: { title: 'Identify the original capacitor', body: 'Send the motor model, original label or drawing, dimensions and quantity for a model comparison.', series: ['Ask about a part'] },
};
const samples: Record<string, { src: string; alt: string }> = {
  pump: { src: '/images/real/cbb60-hanxing-wired.jpg', alt: 'Original CBB60 sample with wire leads' },
  fan: { src: '/images/real/cbb61-leads-10.jpg', alt: 'Original CBB61 sample with wire leads' },
  appliance: { src: '/images/real/cbb61-13.jpg', alt: 'Original CBB61 sample with blade terminals' },
  hvac: { src: '/images/real/cbb65-dual-run-7.jpg', alt: 'Original CBB65 sample with terminal groups and packaging' },
};
export default function SelectionAssistant({ variant }: { variant?: 'field-guide' | 'compact' }) {
  const [choice, setChoice] = useState('pump');
  const result = rules[choice];
  const fieldGuide = variant === 'field-guide';
  const compact = variant === 'compact';
  const sample = samples[choice];
  return <div className={`selection-panel${fieldGuide ? ' rfq-selection' : ''}${compact ? ' selection-panel--compact' : ''}`}>
    {fieldGuide ? <h2>Equipment type</h2> : <h3>Equipment type</h3>}
    <div className="selection-options" role="group" aria-label="Select application">
      {([['pump','Water pumps'],['fan','Fans and blowers'],['appliance','Washing machines'],['hvac','Air conditioners / HVAC'],['other','Other motor']] as const).map(([value,label])=><button className={`selection-option ${choice===value?'selected':''}`} type="button" aria-pressed={choice===value} onClick={()=>setChoice(value)} key={value}>{label}</button>)}
    </div>
    <div className="selection-result">
      <div className="selection-result-copy"><div aria-live="polite" aria-atomic="true"><h3>{result.title}</h3><p>{result.body}</p></div>
        <ul className="pill-list">{result.series.map(s=>{const product=products.find(p=>p.code===s); return <li key={s}><a href={product ? `/products/${product.slug}/` : '/contact/#inquiry-form'}>{s}</a></li>;})}</ul>
        <a className={compact ? 'button secondary' : 'button'} href={`/contact/?application=${encodeURIComponent(choice)}&request=quote#inquiry-form`}>Ask about your capacitor</a>
      </div>
      {fieldGuide && sample && <figure className={`rfq-selection-photo rfq-selection-photo--${choice}`}><div className="rfq-photo-window"><img src={sample.src} alt={sample.alt} width="2000" height="2000" loading="lazy" /></div>{choice === 'hvac' && <figcaption>Terminal detail</figcaption>}</figure>}
    </div>
  </div>;
}
