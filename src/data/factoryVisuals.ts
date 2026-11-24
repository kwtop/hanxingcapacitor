/** AI-refined display imagery. Original references remain the documentary source. */
export const factoryVisuals = {
  "workshop": {
    "src": "/images/previews/factory-20261019/workshop.webp",
    "original": "/images/real/inspection-station.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Operator beside capacitor production equipment.",
    "caption": "AI-refined image"
  },
  "film": {
    "src": "/images/previews/factory-20261019/film.webp",
    "original": "/images/real/film-rolls.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Film rolls and a red lever on processing equipment.",
    "caption": "AI-refined image"
  },
  "winding": {
    "src": "/images/previews/factory-20261019/winding.webp",
    "original": "/images/real/winding-equipment.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Winding equipment and its control panel.",
    "caption": "AI-refined image"
  },
  "testing": {
    "src": "/images/previews/factory-20261019/testing.webp",
    "original": "/images/real/test-area.jpg",
    "width": 1672,
    "height": 941,
    "alt": "Operator beside an instrument panel and electrical test cabinets.",
    "caption": "AI-refined image"
  },
  "packing": {
    "src": "/images/previews/factory-20261019/packing.webp",
    "original": "/images/real/packing-scene.jpg",
    "width": 1536,
    "height": 1024,
    "alt": "Worker and blue capacitor boxes at a packing worktable.",
    "caption": "AI-reconstructed scene"
  },
  "batch": {
    "src": "/images/previews/factory-20261019/batch.webp",
    "original": "/images/real/batch-products.jpg",
    "width": 1536,
    "height": 1024,
    "alt": "HAN XING CBB65 capacitors with blue markings and terminal groups.",
    "caption": "AI-refined image"
  },
  "dispatch": {
    "src": "/images/previews/factory-20261019/dispatch.webp",
    "original": "/images/real/dispatch-pallets.jpg",
    "width": 1448,
    "height": 1086,
    "alt": "Wrapped cartons stacked on pallets in a dispatch area.",
    "caption": "AI-refined image"
  }
} as const;
export type FactoryVisualName = keyof typeof factoryVisuals;

/** Documentary display sources. Optimized files only resize and encode originals. */
export const originalFactoryVisuals = {
  workshop: { src:'/images/real/optimized/inspection-station.webp', width:1440, height:810, alt:'Operator beside capacitor production equipment.' },
  film: { src:'/images/real/optimized/film-rolls.webp', width:1440, height:810, alt:'Film rolls and a red lever on processing equipment.' },
  winding: { src:factoryVisuals.winding.original, width:1920, height:1080, alt:'Winding equipment and its control panel.' },
  testing: { src:factoryVisuals.testing.original, width:1920, height:1080, alt:'Worker beside equipment in an electrical test area.' },
  packing: { src:factoryVisuals.packing.original, width:540, height:960, alt:'Worker handling product boxes at a packing worktable.' },
  batch: { src:'/images/real/optimized/batch-products.webp', width:1440, height:810, alt:'HAN XING metal-can capacitor samples grouped on a work surface.' },
  dispatch: { src:'/images/real/optimized/dispatch-pallets.webp', width:1440, height:1080, alt:'Wrapped cartons on pallets in a dispatch area.' },
} as const;
