/** Supplied original photographs. Source paths and hashes: docs/HOME-SIX-SECTIONS-20261027-assets.json. */
const root = '/images/customer-visits-20261027/';
const photo = (id: string, caption: string, alt: string, width: number, height: number, focus = '50% 35%') => ({
  id, caption, alt, width, height, focus,
  src: `${root}${id}-800.webp`,
  srcset: [480, 800, 1200].map(size => `${root}${id}-${size}.webp ${size}w`).join(', '),
  fullSrc: `${root}${id}-1200.webp`,
});
export const customerVisits = [
  photo('exhibition-group', 'At the Hanxing exhibition booth', 'Visitors at a HAN XING capacitor exhibition booth.', 1706, 1279, '50% 40%'),
  photo('capacitor-booth', 'Meeting at the capacitor display', 'Visitors beside a capacitor display at an exhibition booth.', 1279, 1706, '50% 29%'),
  photo('exhibition-meeting', 'An exhibition meeting', 'Exhibition group beside HAN XING capacitor boxes and samples.', 3072, 4096, '50% 31%'),
  photo('sample-discussion', 'Discussing product samples', 'People discussing capacitor samples at an exhibition table.', 1706, 1279, '50% 48%'),
  photo('workshop-visit', 'A visit to the workshop', 'Visitors watching metal-can work at a production station.', 3024, 4032, '50% 48%'),
] as const;
