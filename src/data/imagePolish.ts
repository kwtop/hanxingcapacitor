/** Studio presentations derived from supplied samples; never technical or shipment evidence. */
export type PolishedMedia = { src: string; srcset: string; width: number; height: number; alt: string; thumb?: string };
const root = '/images/industrial-polish-20261026/';
const product = (name: string, alt: string): PolishedMedia => ({
  src: `${root}${name}-1024.webp`,
  srcset: [480, 800, 1024].map(w => `${root}${name}-${w}.webp ${w}w`).join(', '),
  width: 1024, height: 1536, alt, thumb: `${root}${name}-240.webp`,
});
const editorial = (name: string, alt: string): PolishedMedia => ({
  src: `${root}${name}-1280.webp`,
  srcset: [480, 800, 1280, 1536].map(w => `${root}${name}-${w}.webp ${w}w`).join(', '),
  width: 1536, height: 1024, alt,
});
export const polishedProducts: Record<string, PolishedMedia> = {
  CBB60: product('cbb60', 'Illustrative studio view based on the supplied Hanxing CBB60 wired sample.'),
  CBB61: product('cbb61', 'Illustrative studio view based on the supplied 4.5 microfarad CBB61 blade-terminal sample.'),
  CBB65: product('cbb65', 'Illustrative studio view based on the supplied Hanxing 20 microfarad CBB65 single-run sample.'),
  CD60: product('cd60', 'Illustrative studio view based on the supplied 500 microfarad CD60 start-capacitor sample.'),
};
export const polishedEditorial = {
  connections: editorial('connections', 'Illustrative Hanxing CBB60 wired sample and CBB61 blade-terminal sample on a brushed-steel surface.'),
  terminals: editorial('terminals', 'Illustrative close view of the two terminal groups and rolled rim on a CBB65 single-run sample.'),
  packing: editorial('packing', 'Illustrative Hanxing CBB65 sample, branded box and plain protective carton based on the supplied product photographs.'),
  technical: editorial('technical', 'Illustrative Hanxing CBB60 and CBB65 samples beside an open caliper and an unnumbered outline drawing.'),
  catalog: editorial('catalog', 'Illustrative CBB60, CBB61, CBB65 and CD60 product family on a brushed-steel studio bench.'),
};
const entries = [...Object.values(polishedProducts), ...Object.values(polishedEditorial)];
export const findPolishedMedia = (src: string) => entries.find(asset => src.startsWith(asset.src.replace(/-\d+\.webp$/, '-')));
