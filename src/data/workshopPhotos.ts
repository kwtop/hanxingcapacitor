import { processGallery } from './processGallery';
import { type ReusedEditorialImage } from './reusedEditorial';
import { interiorPhotography as reusedEditorial } from './interiorPhotography';
import { polishedProducts as reusedProducts } from './imagePolish';
import { sourcePhotography } from './sourcePhotography';

export type WorkshopPhoto = {
  slug: string;
  alt: string;
  caption: string;
  illustrative?: boolean;
  focus?: string;
  src?: string;
  originalSrc?: string;
  srcset?: string;
  width?: number;
  height?: number;
  frame?: 'landscape' | 'portrait';
  fit?: 'cover' | 'contain';
  illustrationNote?: string;
};

const portraitSlugs = new Set([
  'box-packing', 'can-handling', 'factory-visit', 'factory-walk', 'forklift',
  'packing-close', 'pallets-staged', 'sample-discussion', 'sample-review',
  'terminal-assembly', 'terminal-detail', 'truck-boxes', 'truck-departure', 'truck-loading',
]);
const photo = (slug: string, alt: string, caption: string, options: Partial<Omit<WorkshopPhoto, 'slug' | 'alt' | 'caption'>> = {}): WorkshopPhoto => ({ slug, alt, caption, frame: portraitSlugs.has(slug) ? 'portrait' : 'landscape', ...options });
const sourceScene = (slug: keyof typeof sourcePhotography, alt: string, caption: string): WorkshopPhoto => {
  const source = sourcePhotography[slug];
  return photo(slug, alt, caption, {
    illustrative: false, frame: source.frame === 'portrait' ? 'portrait' : 'landscape',
    src: source.src, srcset: source.srcset, width: source.width, height: source.height,
    originalSrc: source.original,
  });
};

export const workshopPhotos = {
  filmFloor: photo('film-floor', 'Film-processing equipment on a blue-floor workshop line.', 'Film-processing equipment'),
  filmFloorEditorial: sourceScene('film-floor', 'Film-processing room.', 'Film-processing room'),
  filmWeb: photo('film-web', 'Reflective film web passing through rollers.', 'Film at the rollers'),
  filmRoll: photo('film-roll', 'Dark film wound on a machine spindle.', 'Film roll on the spindle'),
  productionLine: photo('production-line', 'Enclosed equipment and control panels.', 'Equipment on the line'),
  testing: photo('testing', 'Worker beside equipment and control panels.', 'Test-area equipment'),
  canProcess: photo('can-process', 'Metal capacitor can bodies positioned in production equipment.', 'Can bodies in process'),
  canGroup: photo('can-group', 'Metal capacitor cans grouped on a work surface.', 'Metal cans on the work surface'),
  canGroupEditorial: sourceScene('batch', 'Metal capacitor cans.', 'Metal can forms'),
  canHandling: photo('can-handling', 'Worker handling metal can bodies beside workshop equipment.', 'Can handling at the workstation', { focus: '50% 35%' }),
  terminalAssembly: photo('terminal-assembly', 'Gloved hands working on a metal can component.', 'Work at the assembly bench'),
  terminalDetail: photo('terminal-detail', 'Close view of gloved hands and a metal can at workshop equipment.', 'Component handling detail'),
  boxPacking: photo('box-packing', 'Worker arranging blue individual product boxes at a packing table.', 'Individual boxes at the packing table', { focus: '50% 37%' }),
  packingClose: photo('packing-close', 'Worker handling blue product boxes near a bin of components.', 'Packing worktable', { focus: '50% 42%' }),
  palletsStaged: photo('pallets-staged', 'Stacks of cartons on pallets.', 'Cartons staged on pallets'),
  truckLoading: photo('truck-loading', 'Forklift carrying wrapped pallet cartons beside a green truck.', 'Pallets beside the truck'),
  truckLoadingEditorial: sourceScene('29-lift-to-truck', 'Forklift carrying wrapped cartons toward a truck.', 'Loading area'),
  forklift: photo('forklift', 'Red forklift positioned between warehouse buildings.', 'Forklift in the loading lane'),
  truckBoxes: photo('truck-boxes', 'Cartons stacked on a truck during loading.', 'Cartons on the truck'),
  truckDeparture: photo('truck-departure', 'Red truck outside the warehouse buildings.', 'Truck outside the loading area'),
  sampleDiscussion: photo('sample-discussion', 'Three people discussing sample components at a display table.', 'Discussing samples at the table', { focus: '50% 45%' }),
  sampleReview: photo('sample-review', 'Two people examining a component at a worktable.', 'Examining a component'),
  factoryWalk: photo('factory-walk', 'Visitors viewing metal can work at a workshop line.', 'Viewing the workshop line'),
  factoryVisit: photo('factory-visit', 'Two people discussing equipment in the workshop.', 'Discussion beside equipment'),
  reelEquipmentWide: sourceScene('07-reel-equipment', 'Film reels and processing equipment.', 'Film reels on the line'),
  assemblyMachineWide: sourceScene('09-assembly-machine', 'Metal-can assembly station and gloved hands.', 'Assembly station'),
  terminalArrayWide: sourceScene('13-terminal-array', 'Metal cans with terminal groups in a workshop bin.', 'Terminal groups in the bin'),
  palletsWide: sourceScene('28-outdoor-pallets', 'Wrapped pallets outside the warehouse.', 'Pallets in the loading lane'),
} as const;

// Reuse the gallery's captions and source/illustration classifications across pages.
const processBySlug = new Map(processGallery.flatMap(chapter => chapter.photos).map(item => [item.slug, item]));
const processPhoto = (slug: string): WorkshopPhoto => {
  const item = processBySlug.get(slug);
  if (!item) throw new Error(`Unknown process image: ${slug}`);
  return { ...item };
};
const editorialPhoto = (slug: string, caption: string, image: ReusedEditorialImage, frame: WorkshopPhoto['frame'] = 'landscape'): WorkshopPhoto => photo(slug, image.alt, caption, {
  src: image.src, srcset: image.srcset, width: image.width, height: image.height,
  frame, fit: frame === 'portrait' ? 'contain' : 'cover', illustrative: true,
  illustrationNote: 'Illustrative product view',
});
const samplePhoto = (slug: string, caption: string, alt: string, name: string, originalSrc: string): WorkshopPhoto => {
  const base = `/images/sample-evidence-20261027/${name}`;
  return photo(slug, alt, caption, {
    src: `${base}-960.webp`, srcset: [600, 960, 1440].map(width => `${base}-${width}.webp ${width}w`).join(', '),
    width: 2000, height: 2000, originalSrc, frame: 'portrait', fit: 'contain',
  });
};
const sourceSamples = {
  cbb60: samplePhoto('sample-cbb60', 'CBB60 sample', 'CBB60 wired sample with its label.', 'cbb60', '/images/real/cbb60-hanxing-wired.jpg'),
  cbb65Single: samplePhoto('sample-cbb65-single', 'CBB65 single-run sample', 'CBB65 single-run sample marked 20 microfarads and 450 VAC.', 'cbb65-single', '/images/real/cbb65-2.jpg'),
  cbb65Dual: samplePhoto('sample-cbb65-dual', 'CBB65 dual-run sample', 'CBB65 dual-run sample marked 50 plus 5 microfarads and 450 VAC.', 'cbb65-dual', '/images/real/cbb65-dual-run-7.jpg'),
  cd60: samplePhoto('sample-cd60', 'CD60 sample', 'CD60 start-capacitor sample with its label.', 'cd60', '/images/real/cd60-25.jpg'),
} as const;
const productViews = {
  cbb60: editorialPhoto('view-cbb60', 'CBB60 cylindrical case', reusedProducts.CBB60, 'portrait'),
  cbb61: editorialPhoto('view-cbb61', 'CBB61 rectangular case', reusedProducts.CBB61, 'portrait'),
  cbb65: editorialPhoto('view-cbb65', 'CBB65 metal case', reusedProducts.CBB65, 'portrait'),
  cd60: editorialPhoto('view-cd60', 'CD60 start-capacitor case', reusedProducts.CD60, 'portrait'),
} as const;
const oemView = editorialPhoto('oem-config', 'Wired and blade-terminal formats', reusedEditorial.connections);
const packingView = editorialPhoto('packing-illustration', 'Packing arrangement', reusedEditorial.packing);

export const workshopStorySets = {
  home: [workshopPhotos.filmFloorEditorial, workshopPhotos.boxPacking, workshopPhotos.palletsWide, workshopPhotos.sampleDiscussion, workshopPhotos.canGroupEditorial, processPhoto('03-machine-output'), processPhoto('23-tray-racks')],
  factory: [workshopPhotos.filmFloor, workshopPhotos.filmWeb, workshopPhotos.reelEquipmentWide, processPhoto('03-machine-output'), workshopPhotos.productionLine, processPhoto('14-press-detail'), workshopPhotos.canProcess, workshopPhotos.assemblyMachineWide, workshopPhotos.canHandling, processPhoto('17-empty-cans'), workshopPhotos.testing],
  packing: [workshopPhotos.truckLoadingEditorial, workshopPhotos.boxPacking, workshopPhotos.packingClose, workshopPhotos.palletsWide, workshopPhotos.forklift, workshopPhotos.truckLoading, workshopPhotos.truckBoxes, workshopPhotos.truckDeparture, processPhoto('25-packing-worker'), processPhoto('27-bench-rows'), packingView],
  about: [workshopPhotos.sampleDiscussion, workshopPhotos.sampleReview, workshopPhotos.factoryWalk, workshopPhotos.factoryVisit, workshopPhotos.canHandling],
  oem: [workshopPhotos.canGroupEditorial, workshopPhotos.terminalArrayWide, workshopPhotos.assemblyMachineWide, workshopPhotos.sampleReview, workshopPhotos.packingClose, processPhoto('17-empty-cans'), oemView],
  quality: [workshopPhotos.filmFloor, processPhoto('09-assembly-machine'), workshopPhotos.boxPacking],
  buying: [workshopPhotos.sampleReview, processPhoto('25-packing-worker'), workshopPhotos.truckLoading],
} as const;

export const guideWorkshopStories: Record<string, { eyebrow: string; title: string; intro: string; photos: readonly WorkshopPhoto[] }> = {
  'start-vs-run-capacitors': {
    eyebrow: 'Workshop context', title: 'The metal can and film work in the supplied footage',
    intro: 'Workshop and capacitor views show the case formats. Use the capacitor labels and motor circuit requirements to identify run or start duty.',
    photos: [workshopPhotos.filmWeb, workshopPhotos.canGroup, workshopPhotos.testing, productViews.cd60],
  },
  'cbb60-vs-cbb61-vs-cbb65': {
    eyebrow: 'Case formats', title: 'Three case styles at a glance',
    intro: 'Compare the cylindrical, rectangular and metal-can case formats. Check the label and drawing for the selected model.',
    photos: [productViews.cbb60, productViews.cbb61, productViews.cbb65],
  },
  'read-motor-capacitor-label': {
    eyebrow: 'Original samples', title: 'Look at the original label',
    intro: 'These are photographs of individual supplied samples. Read the markings on the exact part and confirm them against its model documents.',
    photos: [sourceSamples.cbb60, sourceSamples.cbb65Single, sourceSamples.cd60],
  },
  'capacitance-voltage-guide': {
    eyebrow: 'Original samples', title: 'Ratings on individual samples',
    intro: 'Compare the markings on these supplied samples with the label on the part being specified.',
    photos: [sourceSamples.cbb60, sourceSamples.cbb65Single],
  },
  'single-vs-dual-run-capacitors': {
    eyebrow: 'Original samples', title: 'Single and dual-run examples',
    intro: 'These photographs show individual supplied CBB65 samples. Verify the terminal arrangement and both dual-run values on the exact part.',
    photos: [sourceSamples.cbb65Single, sourceSamples.cbb65Dual],
  },
  'dimensions-terminals-mounting': {
    eyebrow: 'Workshop context', title: 'Component forms and handling',
    intro: 'Close views show why the case, terminal end and connection space each need their own drawing measurements.',
    photos: [workshopPhotos.canGroup, workshopPhotos.terminalAssembly, workshopPhotos.terminalDetail],
  },
  'motor-capacitor-order-shipment-checklist': {
    eyebrow: 'Packing context', title: 'From individual boxes to loaded cartons',
    intro: 'A closer look at packing and dispatch. Confirm quantities, marks and handover against the order records.',
    photos: [workshopPhotos.boxPacking, workshopPhotos.palletsStaged, workshopPhotos.truckBoxes, processPhoto('25-packing-worker'), processPhoto('27-bench-rows'), packingView],
  },
};
