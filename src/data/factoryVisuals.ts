/** AI-refined display imagery. Original references remain the documentary source. */
export const factoryVisuals = {
  "workshop": {
    "src": "/images/previews/factory-20261019/workshop.webp",
    "original": "/images/real/inspection-station.jpg",
    "width": 1672,
    "height": 941,
    "alt": "AI-refined view of the operator and capacitor equipment in the supplied workshop image.",
    "caption": "AI-refined image"
  },
  "film": {
    "src": "/images/previews/factory-20261019/film.webp",
    "original": "/images/real/film-rolls.jpg",
    "width": 1672,
    "height": 941,
    "alt": "AI-refined close view of the film rolls and red lever in the original production still.",
    "caption": "AI-refined image"
  },
  "winding": {
    "src": "/images/previews/factory-20261019/winding.webp",
    "original": "/images/real/winding-equipment.jpg",
    "width": 1672,
    "height": 941,
    "alt": "AI-refined view of the winding equipment and control panel in the original image.",
    "caption": "AI-refined image"
  },
  "testing": {
    "src": "/images/previews/factory-20261019/testing.webp",
    "original": "/images/real/test-area.jpg",
    "width": 1672,
    "height": 941,
    "alt": "AI-refined view of the original operator, instrument panel and test-area cabinets.",
    "caption": "AI-refined image"
  },
  "packing": {
    "src": "/images/previews/factory-20261019/packing.webp",
    "original": "/images/real/packing-scene.jpg",
    "width": 1536,
    "height": 1024,
    "alt": "AI-reconstructed wider view of the packing worker and blue capacitor boxes in the supplied video still.",
    "caption": "AI-reconstructed scene"
  },
  "batch": {
    "src": "/images/previews/factory-20261019/batch.webp",
    "original": "/images/real/batch-products.jpg",
    "width": 1536,
    "height": 1024,
    "alt": "AI-refined view of the original Hanxing CBB65 samples, retaining the blue markings and terminal arrangement.",
    "caption": "AI-refined image"
  },
  "dispatch": {
    "src": "/images/previews/factory-20261019/dispatch.webp",
    "original": "/images/real/dispatch-pallets.jpg",
    "width": 1448,
    "height": 1086,
    "alt": "AI-refined view of the wrapped pallets in the supplied dispatch-area image; not an order or delivery record.",
    "caption": "AI-refined image"
  }
} as const;
export type FactoryVisualName = keyof typeof factoryVisuals;

/** Documentary display sources. Optimized files only resize and encode originals. */
export const originalFactoryVisuals = {
  workshop: { src:'/images/real/optimized/inspection-station.webp', width:1440, height:810, alt:'Operator beside capacitor equipment in the supplied workshop photograph.' },
  film: { src:'/images/real/optimized/film-rolls.webp', width:1440, height:810, alt:'Film rolls and a red lever in the supplied production footage.' },
  winding: { src:factoryVisuals.winding.original, width:1920, height:1080, alt:'Winding equipment and its control panel in the supplied production footage.' },
  testing: { src:factoryVisuals.testing.original, width:1920, height:1080, alt:'Worker and equipment in the supplied test-area footage.' },
  packing: { src:factoryVisuals.packing.original, width:540, height:960, alt:'Product boxes being handled at the worktable in the supplied packing footage.' },
  batch: { src:'/images/real/optimized/batch-products.webp', width:1440, height:810, alt:'Hanxing-marked metal-can capacitor samples in the supplied photograph.' },
  dispatch: { src:'/images/real/optimized/dispatch-pallets.webp', width:1440, height:1080, alt:'Wrapped cartons on pallets in the supplied dispatch-area photograph.' },
} as const;
