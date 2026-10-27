/** Transcribed labels, not catalogue SKUs, measured results or stock records. */
export type SampleEvidence = {
  id: string;
  series: string;
  reference: string;
  location: string;
  capacitance: string;
  voltage: string;
  tolerance: string;
  frequency: string;
  connection: string;
  image: string;
};

export const sampleEvidence: SampleEvidence[] = [
  { id: 'label-cbb60-35', series: 'CBB60', reference: '35 µF wired sample', location: 'Hanxing-marked sample', capacitance: '35 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Two insulated wire leads', image: '/images/real/cbb60-hanxing-wired.jpg' },
  { id: 'label-p003-25', series: 'CBB60', reference: 'P003', location: 'Horizontal sample', capacitance: '25 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Lead wires; base stud visible', image: '/images/real/cbb60-18.jpg' },
  { id: 'label-p018-4p5', series: 'CBB61', reference: 'P018', location: 'Left sample', capacitance: '4.5 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Blade terminals', image: '/images/real/cbb61-13.jpg' },
  { id: 'label-p018-5', series: 'CBB61', reference: 'P018', location: 'Middle sample', capacitance: '5 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Blade terminals', image: '/images/real/cbb61-13.jpg' },
  { id: 'label-p018-6', series: 'CBB61', reference: 'P018', location: 'Right sample', capacitance: '6 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Blade terminals', image: '/images/real/cbb61-13.jpg' },
  { id: 'label-p029-20', series: 'CBB65', reference: 'P029', location: 'Single-run sample', capacitance: '20 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Two insulated terminal groups', image: '/images/real/cbb65-2.jpg' },
  { id: 'label-p034-50plus5', series: 'CBB65', reference: 'P034', location: 'Dual-run sample', capacitance: '50+5 µF', voltage: '450 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Multiple terminal groups; mapping requires a drawing', image: '/images/real/cbb65-dual-run-7.jpg' },
  { id: 'label-p038-500', series: 'CD60', reference: 'P038', location: 'Start-capacitor sample', capacitance: '500 µF', voltage: '300 VAC', tolerance: '±5%', frequency: '50/60 Hz', connection: 'Blade terminals', image: '/images/real/cd60-25.jpg' },
];

export const sampleEvidenceNotes: Record<string, string> = {
  CBB60: 'The 35 µF sample is the wired Hanxing part in the gallery. P003 records the horizontal 25 µF sample; that photograph also includes a separate D&L-marked part.',
  CBB61: 'P018 shows three individual capacitors. The labels show 40/70/21 and do not identify a brand.',
  CBB65: 'The dual-run sample is marked 50+5 µF, with a separate value for each capacitance section.',
  CD60: 'P038 is marked ±5% and −40°C/70°C/21; the series values are ±10% / ±20% and −20 to +65 °C. Use this sample’s datasheet for its approved tolerance, temperature and starting duty.',
};

export const sampleEvidenceText = (sample: SampleEvidence) =>
  `${sample.reference} · ${sample.location}; photographed label: ${sample.series}, ${sample.capacitance}, ${sample.voltage}, ${sample.tolerance}, ${sample.frequency}; visible connection: ${sample.connection}. Please provide the model number, datasheet, dimensioned drawing and availability.`;
