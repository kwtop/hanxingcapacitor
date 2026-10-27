export type WorkshopPhoto = {
  slug: string;
  alt: string;
  caption: string;
  illustrative?: boolean;
  focus?: string;
  src?: string;
  frame?: 'landscape' | 'portrait';
};

const portraitSlugs = new Set([
  'box-packing', 'can-handling', 'factory-visit', 'factory-walk', 'forklift',
  'packing-close', 'pallets-staged', 'sample-discussion', 'sample-review',
  'terminal-assembly', 'terminal-detail', 'truck-boxes', 'truck-departure', 'truck-loading',
]);
const photo = (slug: string, alt: string, caption: string, options: Pick<WorkshopPhoto, 'illustrative' | 'focus' | 'src' | 'frame'> = {}): WorkshopPhoto => ({ slug, alt, caption, frame: portraitSlugs.has(slug) ? 'portrait' : 'landscape', ...options });
const wideScene = (slug: string, alt: string, caption: string): WorkshopPhoto => photo(slug, alt, caption, {
  illustrative: true,
  frame: 'landscape',
  src: `/images/process-gallery-20261026/${slug}.webp`,
});

export const workshopPhotos = {
  filmFloor: photo('film-floor', 'Film-processing equipment on a blue-floor workshop line, extracted from supplied video.', 'Film-processing equipment'),
  filmFloorEditorial: photo('film-floor-editorial', 'Illustrative visual reconstruction of the film-processing room in supplied footage.', 'Film-processing room', { illustrative: true }),
  filmWeb: photo('film-web', 'Reflective film web passing through rollers in the supplied production video.', 'Film at the rollers'),
  filmRoll: photo('film-roll', 'Dark film wound on a machine spindle in the supplied production video.', 'Film roll on the spindle'),
  productionLine: photo('production-line', 'Enclosed equipment and control panels in the supplied workshop video.', 'Equipment on the line'),
  testing: photo('testing', 'Worker beside equipment and control panels in the supplied test-area video.', 'Test-area equipment'),
  canProcess: photo('can-process', 'Metal capacitor can bodies positioned in production equipment in the supplied video.', 'Can bodies in process'),
  canGroup: photo('can-group', 'Metal capacitor cans grouped on a work surface in the supplied video.', 'Metal cans on the work surface'),
  canGroupEditorial: photo('can-group-editorial', 'Illustrative reconstruction of grouped metal capacitor cans from supplied footage.', 'Metal can forms', { illustrative: true }),
  canHandling: photo('can-handling', 'Worker handling metal can bodies beside workshop equipment in the supplied video.', 'Can handling at the workstation', { focus: '50% 35%' }),
  terminalAssembly: photo('terminal-assembly', 'Gloved hands working on a metal can component in the supplied video.', 'Work at the assembly bench'),
  terminalDetail: photo('terminal-detail', 'Close view of gloved hands and a metal can at workshop equipment in the supplied video.', 'Component handling detail'),
  boxPacking: photo('box-packing', 'Worker arranging blue individual product boxes at a packing table in the supplied video.', 'Individual boxes at the packing table', { focus: '50% 37%' }),
  packingClose: photo('packing-close', 'Worker handling blue product boxes near a bin of components in the supplied video.', 'Packing worktable', { focus: '50% 42%' }),
  palletsStaged: photo('pallets-staged', 'Stacks of cartons on pallets in the supplied warehouse video.', 'Cartons staged on pallets'),
  truckLoading: photo('truck-loading', 'Forklift carrying wrapped pallet cartons beside a green truck in the supplied video.', 'Pallets beside the truck'),
  truckLoadingEditorial: photo('truck-loading-editorial', 'Illustrative reconstruction of forklift and truck scene based on supplied video.', 'Loading area overview', { illustrative: true }),
  forklift: photo('forklift', 'Red forklift positioned between warehouse buildings in the supplied video.', 'Forklift in the loading lane'),
  truckBoxes: photo('truck-boxes', 'Cartons stacked on a truck during loading in the supplied video.', 'Cartons on the truck'),
  truckDeparture: photo('truck-departure', 'Red truck outside the warehouse buildings in the supplied video.', 'Truck outside the loading area'),
  sampleDiscussion: photo('sample-discussion', 'Three people discussing sample components at a display table in the supplied photograph.', 'Discussing samples at the table', { focus: '50% 45%' }),
  sampleReview: photo('sample-review', 'Two people examining a component at a worktable in the supplied photograph.', 'Examining a component'),
  factoryWalk: photo('factory-walk', 'Visitors viewing metal can work at a workshop line in the supplied photograph.', 'Viewing the workshop line'),
  factoryVisit: photo('factory-visit', 'Two people discussing equipment in the workshop in the supplied photograph.', 'Discussion beside equipment'),
  reelEquipmentWide: wideScene('07-reel-equipment', 'Illustrative wider view of film reels and processing equipment based on supplied footage.', 'Film reels on the line'),
  assemblyMachineWide: wideScene('09-assembly-machine', 'Illustrative wider view of a metal-can assembly station and gloved hands based on supplied footage.', 'Assembly station overview'),
  terminalArrayWide: wideScene('13-terminal-array', 'Illustrative wider view of metal cans with terminal groups in a workshop bin based on supplied footage.', 'Terminal groups in the bin'),
  palletsWide: wideScene('28-outdoor-pallets', 'Illustrative wider view of wrapped pallets outside the warehouse based on supplied footage.', 'Pallets in the loading lane'),
} as const;

export const workshopStorySets = {
  home: [workshopPhotos.filmFloorEditorial, workshopPhotos.boxPacking, workshopPhotos.palletsWide, workshopPhotos.sampleDiscussion, workshopPhotos.canGroupEditorial],
  factory: [workshopPhotos.filmFloor, workshopPhotos.filmWeb, workshopPhotos.reelEquipmentWide, workshopPhotos.productionLine, workshopPhotos.canProcess, workshopPhotos.assemblyMachineWide, workshopPhotos.canHandling, workshopPhotos.testing],
  packing: [workshopPhotos.truckLoadingEditorial, workshopPhotos.boxPacking, workshopPhotos.packingClose, workshopPhotos.palletsWide, workshopPhotos.forklift, workshopPhotos.truckLoading, workshopPhotos.truckBoxes, workshopPhotos.truckDeparture],
  about: [workshopPhotos.sampleDiscussion, workshopPhotos.sampleReview, workshopPhotos.factoryWalk, workshopPhotos.factoryVisit, workshopPhotos.canHandling],
  oem: [workshopPhotos.canGroupEditorial, workshopPhotos.terminalArrayWide, workshopPhotos.assemblyMachineWide, workshopPhotos.sampleReview, workshopPhotos.packingClose],
} as const;

export const guideWorkshopStories: Record<string, { eyebrow: string; title: string; intro: string; photos: readonly WorkshopPhoto[] }> = {
  'start-vs-run-capacitors': {
    eyebrow: 'Workshop context', title: 'The metal can and film work in the supplied footage',
    intro: 'These frames add manufacturing context. Read the sample labels and circuit requirements above to distinguish run duty from start duty.',
    photos: [workshopPhotos.filmWeb, workshopPhotos.canGroup, workshopPhotos.testing],
  },
  'dimensions-terminals-mounting': {
    eyebrow: 'Workshop context', title: 'Component forms and handling',
    intro: 'Close views show why the case, terminal end and connection space each need their own drawing measurements.',
    photos: [workshopPhotos.canGroup, workshopPhotos.terminalAssembly, workshopPhotos.terminalDetail],
  },
  'motor-capacitor-order-shipment-checklist': {
    eyebrow: 'Packing context', title: 'From individual boxes to loaded cartons',
    intro: 'These video frames show packing and dispatch scenes. Confirm the actual order quantities, marks and handover records against the documents.',
    photos: [workshopPhotos.boxPacking, workshopPhotos.palletsStaged, workshopPhotos.truckBoxes],
  },
};
