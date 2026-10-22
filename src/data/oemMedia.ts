import generated from './oemMedia.generated.json';

/** Source-bound editorial reconstructions; original files/videos remain the evidence. */
const descriptions = {
  'packing-worktable': 'Editorial reconstruction of the supplied packing worktable, operator, white trays and blue product boxes.',
  'workshop-station': 'Editorial reconstruction of the supplied instrument cabinet, capacitor station and operator.',
  'film-process': 'Refined cover based on the supplied film-roll equipment photograph, with its original shaft and red lever.',
  'winding-process': 'Refined cover based on the supplied enclosed winding machine and control panel.',
  'testing-area': 'Refined cover based on the supplied test-area operator, control cabinet and chambers.',
  'dispatch-area': 'Editorial reconstruction of the supplied wrapped pallets and dispatch area; not an order or delivery record.',
  'oem-label-review': 'Hanxing CBB65 sample and its source blue carton arranged for label and packing review.',
} as const;

export type OemMediaName = keyof typeof descriptions;
export const oemMedia = Object.fromEntries(Object.entries(descriptions).map(([name, alt]) => [name, {
  ...generated[name as OemMediaName], alt,
}])) as Record<OemMediaName, (typeof generated)[OemMediaName] & { alt: string }>;
