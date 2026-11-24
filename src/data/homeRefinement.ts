/** ImageGen illustrations. Original footage and samples remain the source evidence. */
const root = '/images/home-refinement-20261027/';

const image = (name: string, alt: string) => ({
  src: `${root}${name}-1280.webp`,
  srcset: [480, 800, 1280, 1536].map(width => `${root}${name}-${width}.webp ${width}w`).join(', '),
  width: 1536,
  height: 1024,
  alt,
  provenance: 'AI-generated illustration based on supplied visual references',
});

export const homeRefinement = {
  oem: image('oem-official-mark', 'HAN XING capacitors with wire leads and blade terminals.'),
  factoryHall: image('factory-hall', 'Production hall with enclosed film-winding equipment.'),
  testing: image('testing', 'Capacitor samples and test cabinets at an electrical workbench.'),
  packing: image('packing', 'Capacitor packing workstation with individual boxes and a divided carton.'),
} as const;
