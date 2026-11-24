/** Source-bound illustrative media for the local Satechi preview. Never documentary evidence. */
const root = '/images/previews/site-refinement-20261019/';
const entries = {
  'oem-sample-review': {alt: 'HAN XING CBB60 and CBB65 capacitors beside a product carton and caliper.', original: '/images/real/cbb65-4.jpg'},
  'oem-connections': {alt: 'CBB60 wire leads, CBB61 blade terminals and CBB65 terminal groups.', original: '/products/photographs/'},
  'packing-protection': {alt: 'Cardboard dividers separating HAN XING CBB65 capacitors.', original: '/images/real/cbb65-4.jpg'},
  'resources-technical': {alt: 'HAN XING run-capacitor cases beside a caliper and blank paper.', original: '/products/photographs/'},
  'buying-inquiry': {alt: 'HAN XING CBB60 capacitor beside blank paper and a plain sample box.', original: '/images/real/cbb60-hanxing-wired.jpg'},
  'order-documents': {alt: 'HAN XING CBB65 capacitor beside blank document sheets.', original: '/images/real/cbb65-4.jpg'},
  'guide-measurement': {alt: 'CBB60 capacitor beside a caliper.', original: '/images/real/cbb60-hanxing-wired.jpg'},
  'label-carton': {alt: 'HAN XING CBB65 capacitor marked 40 µF beside a product carton.', original: '/images/real/cbb65-4.jpg'},
  'quality-process-detail': {alt: 'Operator beside an instrument cabinet and capacitor equipment.', original: '/images/real/inspection-station.jpg'},
  'buyer-photo-details': {alt: 'Hands holding a HAN XING CBB60 capacitor with its label facing forward.', original: '/images/real/cbb60-hanxing-wired.jpg'},
} as const;
export type EditorialMediaName = keyof typeof entries;
export const editorialMedia = Object.fromEntries(Object.entries(entries).map(([name, data]) => [name, {
  ...data,
  src: `${root}${name}-1536.webp`,
  srcset: [640,960,1536].map(width => `${root}${name}-${width}.webp ${width}w`).join(', '),
  width: 1536,
  height: 1024,
  caption: name === 'quality-process-detail' ? 'AI-refined image' : 'AI-arranged illustration',
}])) as Record<EditorialMediaName, {alt:string; original:string; src:string; srcset:string; width:number; height:number; caption:string}>;
export const findEditorialMedia = (src: string) => Object.values(editorialMedia).find(asset => asset.src === src);
