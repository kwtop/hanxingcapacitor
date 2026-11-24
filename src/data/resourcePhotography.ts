/** Guide covers drawn from editorial images and supplied photographs or footage. */
import { aboutHeroFilm } from './aboutHeroFilm';
import { comparisonPhotography } from './comparisonPhotography';
import { hanxingPackaging } from './hanxingPackaging';
import { sourcePhotography } from './sourcePhotography';

type ResourceGuidePhoto = {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  alt: string;
  sourceKind?: string;
};

const image = (name: string, alt: string, directory = 'resources-20261029') => ({
  src: `/images/${directory}/${name}-1280.webp`,
  srcset: [480, 800, 1280, 1536].map(w => `/images/${directory}/${name}-${w}.webp ${w}w`).join(', '),
  width: 1536, height: 1024, alt,
});
const pumpWorkbench = image('cbb60-pump-factory', 'CBB60 capacitor beside a pump motor at an industrial assembly workbench.', 'resource-guides-20261105');
export const resourcePhotography = {
  label: image('label', 'CBB65 metal-can capacitor with its label and terminal groups visible.'),
  series: image('series', 'Cylindrical CBB60, rectangular CBB61 and metal-can CBB65 capacitors.'),
  dimensions: image('dimensions', 'CBB60 capacitor with wire leads beside a caliper.'),
  dual: image('dual', 'CBB65 single-run and dual-run capacitors with two and three terminal groups.'),
};
export const resourceGuidePhotography: Record<string, ResourceGuidePhoto> = {
  'cbb60-capacitor-dimensions-chart': resourcePhotography.dimensions,
  'iec-60252-1-capacitor-safety-classes': resourcePhotography.label,
  'cbb60-water-pump-capacitor-selection': pumpWorkbench,
  'cbb61-wire-leads-blade-terminals': image('cbb61-fan-factory', 'CBB61 capacitor and fan motor components on an industrial assembly bench.', 'resource-guides-20261105'),
  'cbb65-capacitor-temperature-ratings': comparisonPhotography.CBB65,
  'cd60-start-capacitor-duty-cycle': image('guide', 'CD60 start capacitor, contactor and relay at a factory component preparation station.', 'cd60-presentation-20261110'),
  'motor-capacitor-tolerance-test-results': resourcePhotography.label,
  'read-motor-capacitor-label': resourcePhotography.label,
  'cbb60-vs-cbb61-vs-cbb65': resourcePhotography.series,
  'dimensions-terminals-mounting': resourcePhotography.dimensions,
  'single-vs-dual-run-capacitors': image('cbb65-hvac-factory', 'CBB65 single-run capacitor with protective packing and an HVAC subassembly in an industrial workshop.', 'resource-guides-20261105'),
  'cbb60-capacitor-selection': comparisonPhotography.CBB60,
  'cbb61-capacitor-ratings-replacement': comparisonPhotography.CBB61,
  'cd60-capacitor-replacement-specifications': comparisonPhotography.CD60,
  'well-irrigation-pump-capacitor-control-box': comparisonPhotography.CBB60,
  'fan-blower-motor-capacitor-selection': image('cbb61-fan-factory', 'CBB61 capacitor and fan motor components on an industrial assembly bench.', 'resource-guides-20261105'),
  'washing-machine-motor-capacitor-selection': resourcePhotography.dimensions,
  'motor-capacitor-failure-diagnosis': resourcePhotography.label,
  'motor-capacitor-manufacturer-qualification': resourcePhotography.series,
  'motor-capacitor-wholesale-rfq': resourcePhotography.series,
  'motor-capacitor-inspection-report-checklist': resourcePhotography.label,
  'motor-capacitor-manufacturers-china': {
    src: aboutHeroFilm.poster,
    width: aboutHeroFilm.width,
    height: aboutHeroFilm.height,
    alt: aboutHeroFilm.posterAlt,
    sourceKind: 'original-video-frame',
  },
  'china-motor-capacitor-suppliers-pumps-fans-hvac': pumpWorkbench,
  'wholesale-motor-capacitors-china': {
    ...sourcePhotography.dispatch,
    sourceKind: sourcePhotography.dispatch.provenance,
  },
  'wholesale-motor-capacitors-resale-private-label': hanxingPackaging.station,
};
