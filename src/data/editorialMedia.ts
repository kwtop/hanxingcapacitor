/** Source-bound illustrative media for the local Satechi preview. Never documentary evidence. */
const root = '/images/previews/site-refinement-20261019/';
const entries = {
  'oem-sample-review': {alt: 'AI-arranged Hanxing CBB60 and CBB65 samples with their reference carton and a caliper.', original: '/images/real/cbb65-4.jpg'},
  'oem-connections': {alt: 'AI-arranged comparison of wired CBB60, two-blade CBB61 and CBB65 terminal groups.', original: '/products/photographs/'},
  'packing-protection': {alt: 'Illustrative corrugated divider arrangement around Hanxing CBB65 samples, not an actual packout.', original: '/images/real/cbb65-4.jpg'},
  'resources-technical': {alt: 'Illustrative Hanxing run-capacitor case formats beside a caliper and blank paper.', original: '/products/photographs/'},
  'buying-inquiry': {alt: 'Illustrative Hanxing CBB60 sample, blank inquiry paper and plain sample box.', original: '/images/real/cbb60-hanxing-wired.jpg'},
  'order-documents': {alt: 'Illustrative Hanxing CBB65 sample with blank document sheets; no actual order records are shown.', original: '/images/real/cbb65-4.jpg'},
  'guide-measurement': {alt: 'Illustrative CBB60 sample beside a caliper; no measured dimension is asserted.', original: '/images/real/cbb60-hanxing-wired.jpg'},
  'label-carton': {alt: 'AI-arranged Hanxing CBB65 40 microfarad sample beside its source retail carton.', original: '/images/real/cbb65-4.jpg'},
  'quality-process-detail': {alt: 'AI-refined detail of the supplied instrument cabinet, capacitor equipment and original operator.', original: '/images/real/inspection-station.jpg'},
  'buyer-photo-details': {alt: 'Illustrative hands holding a Hanxing CBB60 sample to show its label; not an employee photograph.', original: '/images/real/cbb60-hanxing-wired.jpg'},
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
