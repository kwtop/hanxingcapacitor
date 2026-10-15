export type PhotoExample = { src: string; alt: string; title: string; text: string; focus?: string; zoom?: number; showLabelDetail?: boolean };

const cbb65Label: PhotoExample = {
  src: '/images/real/cbb65-2.jpg',
  alt: 'CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.',
  title: 'Ratings on a CBB65 label',
  text: 'This sample is marked 20 µF ±5%, 450 VAC and 50/60 Hz. Confirm the order specification using the label or datasheet for the model you need.',
  focus: '50%',
  zoom: 1.25,
};
const cbb65Terminals: PhotoExample = {
  src: '/images/real/cbb65-2.jpg',
  alt: 'CBB65 sample with two insulated terminal groups visible at the top.',
  title: 'CBB65 terminal groups',
  text: 'Each of the two insulated bases has several metal tabs. Record the number of groups and the number of blades separately, then check the connections in the model drawing.',
  focus: '50%',
  zoom: 1.25,
};
const cbb65Dual: PhotoExample = {
  src: '/images/real/cbb65-dual-run-7.jpg',
  alt: 'Photograph of a CBB65 dual-run sample marked 50+5 µF and 450 VAC, with several terminal groups visible.',
  title: 'Both ratings on a dual-run sample',
  text: 'The label shows 50+5 µF ±5% and 450 VAC. A replacement must match both capacitance values and the terminal connections specified for the original circuit.',
  focus: '50%',
  zoom: 1.2,
};
const cbb60Stud: PhotoExample = {
  src: '/images/real/cbb60-18.jpg',
  alt: 'Two CBB60 samples showing lead exits and a threaded mounting stud.',
  title: 'CBB60: leads and stud mounting',
  text: 'The upright and horizontal samples show the insulated leads and threaded base stud. Allow space for the stud and for the leads where they leave the case.',
  focus: '50%',
  zoom: 1.14,
};
const cbb61Samples: PhotoExample = {
  src: '/images/real/cbb61-13.jpg',
  alt: 'Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.',
  title: 'CBB61: similar housings, different ratings',
  text: 'These similar CBB61 cases are marked 4.5 µF, 5 µF and 6 µF. Read the rating on each label before checking the case dimensions.',
  focus: '50%',
  zoom: 1.3,
};
const cd60Sample: PhotoExample = {
  src: '/images/real/cd60-25.jpg',
  alt: 'CD60 sample marked 500 µF and 300 VAC, with its blade terminals visible.',
  title: 'CD60 start-capacitor sample',
  text: 'This sample is marked 500 µF and 300 VAC. The motor circuit must require a start capacitor with the appropriate duty and ratings.',
  focus: '50%',
  zoom: 1.25,
};

export const guideExamples: Record<string, { heading: string; photos: PhotoExample[] }> = {
  'start-vs-run-capacitors': { heading: 'Start and run capacitor samples', photos: [{ ...cbb65Label }, { ...cd60Sample }] },
  'cbb60-vs-cbb61-vs-cbb65': { heading: 'Compare the physical formats', photos: [{ ...cbb60Stud }, { ...cbb61Samples }, { ...cbb65Terminals, title: 'CBB65: metal can and terminal groups' }] },
  'single-vs-dual-run-capacitors': { heading: 'Read the label and terminal end together', photos: [{ ...cbb65Label, title: 'Single-run sample: 20 µF · 450 VAC', text: 'The CBB65 sample is marked 20 µF ±5%, 450 VAC and 50/60 Hz. It has one capacitance value.' }, { ...cbb65Dual, title: 'Dual-run sample: 50+5 µF · 450 VAC' }] },
  'read-motor-capacitor-label': { heading: 'Electrical ratings on sample labels', photos: [{ ...cbb65Label }, { ...cbb61Samples, title: 'Different capacitance values within one series' }] },
  'capacitance-voltage-guide': { heading: 'Capacitance and voltage on sample labels', photos: [{ ...cbb65Label, title: '20 µF · 450 VAC · ±5%', text: 'On this CBB65 label, 20 µF ±5% gives the capacitance and tolerance. The voltage rating is 450 VAC.', showLabelDetail: true }, { ...cbb61Samples, title: 'One voltage rating, three capacitances', text: 'All three CBB61 samples show 450 VAC. Their capacitances are 4.5 µF, 5 µF and 6 µF.' }] },
  'dimensions-terminals-mounting': { heading: 'Mounting and connection details in the samples', photos: [{ ...cbb60Stud, title: 'The stud extends beyond the case', text: 'Measure the CBB60 base stud as well as the leads and connector clearance. Check these measurements against the model drawing.' }, { src: '/images/real/cbb61-leads-10.jpg', alt: 'Two rectangular CBB61 samples with red lead wires, visible wire ends and a mounting lug on one case.', title: 'Leads and mounting lug', text: 'Both CBB61 samples have red leads, and one case has a mounting lug. Record the body dimensions and mounting position, then the full route of the leads. Check them against the model drawing.' }] },
  'motor-capacitor-order-shipment-checklist': { heading: 'Packing and shipment checks', photos: [
    { src: '/images/real/packing-scene.jpg', alt: 'Supplied packing photograph showing capacitor boxes and packing work.', title: 'Protection inside the carton', text: 'For your order, compare dated packing photos with the approved specification. Check the protection and dividers, as well as the number of units per carton.' },
    { src: '/images/illustrative/warehouse-staging.webp', alt: 'Illustration of cartons grouped on pallets in a warehouse staging area.', title: 'Carton count and marks', text: 'Use dated photos of the packed order to compare carton count and marks with the packing list.' },
    { src: '/images/illustrative/export-document-review.webp', alt: 'Illustration of shipping forms being checked beside a carton.', title: 'Order references on shipping documents', text: 'Check the actual invoice, packing list and transport record for the same order reference and quantities.' },
  ] },
};
