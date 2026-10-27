import {sundayIndustrial} from './sundayIndustrial';
import {editorialMedia} from './editorialMedia';
import {coherenceMedia} from './coherenceMedia';
import {industrialApplications} from './industrialApplications';
import {polishedProducts} from './imagePolish';
const root = '/images/previews/satechi-site-20261018/';
const refined: Record<string,string> = {
  'product-cbb60':polishedProducts.CBB60.src,
  'product-cbb61':polishedProducts.CBB61.src,
  'product-cbb65':polishedProducts.CBB65.src,
  'product-cd60':polishedProducts.CD60.src,
  'contact-desk':sundayIndustrial.technical.src,
  'guide-duty':sundayIndustrial.catalog.src,
  'application-pump': industrialApplications['pumps-and-water-systems'].src,
  'application-fan': industrialApplications['fans-and-ventilation'].src,
  'application-washing': industrialApplications['appliances-and-small-motors'].src,
  'application-hvac': industrialApplications['hvac-and-refrigeration'].src,
  'oem-approval': editorialMedia['oem-sample-review'].src,
  'resources-desk': sundayIndustrial.technical.src,
  'resources-faq': sundayIndustrial.technical.src,
  'guide-shipping': sundayIndustrial.packing.src,
  'guide-fit': sundayIndustrial.connections.src,
  'guide-dual': coherenceMedia.terminals.src,
  'guide-label': sundayIndustrial.technical.src,
  'guide-series': sundayIndustrial.connections.src,
};
export const siteVisual = (name: string) => refined[name] || `${root}${name}.webp`;
export const applicationVisuals: Record<string, string> = {
  'pumps-and-water-systems': siteVisual('application-pump'),
  'fans-and-ventilation': siteVisual('application-fan'),
  'appliances-and-small-motors': siteVisual('application-washing'),
  'hvac-and-refrigeration': siteVisual('application-hvac'),
};
export const guideVisuals: Record<string, { src: string; alt: string }> = {
  'read-motor-capacitor-label': {src: siteVisual('guide-label'), alt: sundayIndustrial.technical.alt},
  'start-vs-run-capacitors': {src: siteVisual('guide-duty'), alt: sundayIndustrial.catalog.alt},
  'cbb60-vs-cbb61-vs-cbb65': {src: siteVisual('guide-series'), alt: sundayIndustrial.connections.alt},
  'single-vs-dual-run-capacitors': {src: siteVisual('guide-dual'), alt: coherenceMedia.terminals.alt},
  'capacitance-voltage-guide': {src: siteVisual('guide-ratings'), alt: 'Illustrative close view of the capacitance and voltage printed on the supplied CBB65 sample.'},
  'dimensions-terminals-mounting': {src: siteVisual('guide-fit'), alt: sundayIndustrial.connections.alt},
  'motor-capacitor-order-shipment-checklist': {src: siteVisual('guide-shipping'), alt: sundayIndustrial.packing.alt},
};
