import {editorialMedia} from './editorialMedia';
import {coherenceMedia} from './coherenceMedia';
import {industrialApplications} from './industrialApplications';
import {brochureMedia} from './brochureMedia';
const root = '/images/previews/satechi-site-20261018/';
const refined: Record<string,string> = {
  'application-pump': industrialApplications['pumps-and-water-systems'].src,
  'application-fan': industrialApplications['fans-and-ventilation'].src,
  'application-washing': industrialApplications['appliances-and-small-motors'].src,
  'application-hvac': industrialApplications['hvac-and-refrigeration'].src,
  'oem-approval': editorialMedia['oem-sample-review'].src,
  'resources-desk': editorialMedia['resources-technical'].src,
  'resources-faq': editorialMedia['buyer-photo-details'].src,
  'guide-shipping': brochureMedia['cbb65-packaging'].src,
  'guide-fit': brochureMedia['cbb60-terminals'].src,
  'guide-dual': coherenceMedia.terminals.src,
  'guide-label': coherenceMedia.label.src,
  'guide-series': editorialMedia['oem-connections'].src,
};
export const siteVisual = (name: string) => refined[name] || `${root}${name}.webp`;
export const applicationVisuals: Record<string, string> = {
  'pumps-and-water-systems': siteVisual('application-pump'),
  'fans-and-ventilation': siteVisual('application-fan'),
  'appliances-and-small-motors': siteVisual('application-washing'),
  'hvac-and-refrigeration': siteVisual('application-hvac'),
};
export const guideVisuals: Record<string, { src: string; alt: string }> = {
  'read-motor-capacitor-label': {src: siteVisual('guide-label'), alt: coherenceMedia.label.alt},
  'start-vs-run-capacitors': {src: siteVisual('guide-duty'), alt: 'Illustrative comparison of the white wired CBB60 run sample and grey CD60 start sample.'},
  'cbb60-vs-cbb61-vs-cbb65': {src: siteVisual('guide-series'), alt: 'Illustrative arrangement of the three original run-capacitor case formats.'},
  'single-vs-dual-run-capacitors': {src: siteVisual('guide-dual'), alt: coherenceMedia.terminals.alt},
  'capacitance-voltage-guide': {src: siteVisual('guide-ratings'), alt: 'Illustrative close view of the capacitance and voltage printed on the supplied CBB65 sample.'},
  'dimensions-terminals-mounting': {src: siteVisual('guide-fit'), alt: brochureMedia['cbb60-terminals'].alt},
  'motor-capacitor-order-shipment-checklist': {src: siteVisual('guide-shipping'), alt: brochureMedia['cbb65-packaging'].alt},
};
