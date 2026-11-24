/** Studio presentations derived from supplied samples; never technical or shipment evidence. */
import { innerEditorial } from './innerEditorial';
import { sourcePhotography } from './sourcePhotography';
export type PolishedMedia = { src: string; srcset: string; width: number; height: number; alt: string; thumb?: string };
const root = '/images/industrial-polish-20261026/';
const product = (name: string, alt: string, directory = root): PolishedMedia => ({
  src: `${directory}${name}-1024.webp`,
  srcset: [480, 800, 1024].map(w => `${directory}${name}-${w}.webp ${w}w`).join(', '),
  width: 1024, height: 1536, alt, thumb: `${directory}${name}-240.webp`,
});
export const polishedProducts: Record<string, PolishedMedia> = {
  CBB60: product('cbb60', 'HAN XING CBB60 cylindrical capacitor with two insulated wire leads.'),
  CBB61: product('cbb61', 'Black CBB61 rectangular capacitor with two blade terminals.'),
  CBB65: product('cbb65', 'HAN XING CBB65 single-run metal-can capacitor with two terminal groups.'),
  CD60: product('portrait', 'CD60 cylindrical start capacitor with blade terminals.', '/images/cd60-presentation-20261110/'),
};
export const polishedEditorial = {
  ...innerEditorial,
  terminals: sourcePhotography['cbb65-single'],
};
const entries: PolishedMedia[] = [...Object.values(polishedProducts), ...Object.values(polishedEditorial)];
export const findPolishedMedia = (src: string) => entries.find(asset => src.startsWith(asset.src.replace(/-\d+\.webp$/, '-')));
