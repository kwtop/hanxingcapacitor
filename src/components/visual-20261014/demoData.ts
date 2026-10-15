export const studio = (code: string) => `/images/reference-20261012/${code.toLowerCase()}-studio.webp`;
export const guides = [
  { title: 'Read the capacitor label', detail: 'Find the µF, VAC and duty markings.', href: '/resources/read-motor-capacitor-label/' },
  { title: 'Dimensions & connections', detail: 'Check the case, mounting space and terminals.', href: '/resources/dimensions-terminals-mounting/' },
  { title: 'Start or run?', detail: 'Match the capacitor to the motor circuit.', href: '/resources/start-vs-run-capacitors/' },
  { title: 'Single or dual run', detail: 'Read both independent capacitance values.', href: '/resources/single-vs-dual-run-capacitors/' },
];
export const checks = [
  { title: 'Duty', detail: 'The circuit specifies run or switched-start duty.' },
  { title: 'µF & VAC', detail: 'Copy both values from the original label.' },
  { title: 'Dimensions', detail: 'Allow for the case and mounting space.' },
  { title: 'Connections', detail: 'Match the terminals and wiring arrangement.' },
];
export const rating = (code: string, capacitance: string) => code === 'CBB65' ? 'Single 2–100 µF · Dual 1+15 to 15+80 µF' : capacitance;
export const voltage = (code: string, value: string) => code === 'CBB65' ? 'Single 110–450 VAC · Dual 370–450 VAC' : value;
