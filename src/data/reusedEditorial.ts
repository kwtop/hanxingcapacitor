/** Existing ImageGen presentations. Original samples and footage remain the evidence. */
import { homeRefinement } from './homeRefinement';

export interface ReusedEditorialImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  thumb?: string;
}

const root = '/images/sitewide-editorial-20261026/';
const landscape = (name: string, alt: string, height = 1024): ReusedEditorialImage => ({
  src: `${root}${name}-1280.webp`,
  srcset: [480, 800, 1280, 1536].map(width => `${root}${name}-${width}.webp ${width}w`).join(', '),
  width: 1536,
  height,
  alt,
});
const portrait = (name: string, alt: string): ReusedEditorialImage => ({
  src: `${root}${name}-800.webp`,
  srcset: [240, 480, 800, 1024].map(width => `${root}${name}-${width}.webp ${width}w`).join(', '),
  width: 1024,
  height: 1536,
  alt,
  thumb: `${root}${name}-240.webp`,
});

export const reusedEditorial = {
  catalog: landscape('catalog', 'HAN XING motor capacitor case formats on a workbench.', 864),
  connections: homeRefinement.oem,
  packing: landscape('packing', 'Capacitor and individual boxes beside a carton with protective dividers.'),
  technical: landscape('technical', 'Capacitor cases beside a caliper and a drawing sheet.'),
} as const;

export const reusedProducts = {
  CBB60: portrait('cbb60', 'HAN XING cylindrical capacitor with wire leads.'),
  CBB61: portrait('cbb61', 'HAN XING rectangular capacitor with blade terminals.'),
  CBB65: portrait('cbb65', 'HAN XING metal-can capacitor with terminal groups.'),
  CD60: portrait('cd60', 'HAN XING start capacitor with blade terminals.'),
} as const;

const entries: ReusedEditorialImage[] = [...Object.values(reusedEditorial), ...Object.values(reusedProducts)];
export const findReusedEditorial = (src: string) => entries.find(asset => asset.src === src);
