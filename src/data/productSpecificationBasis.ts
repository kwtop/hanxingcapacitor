/** Scope checked against the supplied catalogue and original sample labels, 2026-10-26. */
export const productSpecificationBasis: Record<string, { source: string; scope: string; note: string }> = {
  CBB60: {
    source: 'Zebang catalogue · page 7',
    scope: 'Catalogue ranges for the series. Use the selected model’s drawing for installation dimensions.',
    note: 'The 35 µF wired sample is marked 40/70/21. The catalogue’s +85 °C limit does not apply to that sample.',
  },
  CBB61: {
    source: 'Zebang catalogue · page 5; original sample P018',
    scope: 'The catalogue lists 250–370 VAC and 350–450 VAC groups. Tolerance, frequency and climatic category below come from the photographed samples.',
    note: 'The photographed samples carry the 40/70/21 climatic category. Use the selected model’s datasheet for its operating limits.',
  },
  CBB65: {
    source: 'Zebang catalogue · pages 3–4',
    scope: 'Single-run dimensions below cover the listed 2–100 µF rows. Dual-run ratings are from the catalogue summary.',
    note: 'The dual-run summary extends to 15+80 µF, while its dimension table lists combinations only up to 10+80 µF. Request the drawing for the exact pair of values.',
  },
  CD60: {
    source: 'Zebang catalogue · page 8',
    scope: 'Catalogue series ranges. Starting time and the interval between starts are specified for each model.',
    note: 'The photographed 500 µF / 300 VAC sample is marked ±5% and −40°C/70°C/21, which differ from the catalogue ranges. Its own datasheet is required for these limits.',
  },
};
