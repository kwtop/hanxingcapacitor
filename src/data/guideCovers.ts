export type GuideCoverPhoto = {
  src: string;
  alt: string;
  focus?: string;
  scale?: number;
};

export type GuideCover = { photos: GuideCoverPhoto[] };

// Covers use supplied sample photographs. Articles identify the exact samples.
export const guideCovers: Record<string, GuideCover> = {
  'start-vs-run-capacitors': {
    photos: [
      { src: '/images/real/cbb65-2.jpg', alt: 'CBB65 motor-run capacitor sample', focus: '50% 60%', scale: 1.22 },
      { src: '/images/real/cd60-25.jpg', alt: 'CD60 motor-start capacitor sample', focus: '50% 59%', scale: 1.22 },
    ],
  },
  'cbb60-vs-cbb61-vs-cbb65': {
    photos: [
      { src: '/images/real/cbb60-16.jpg', alt: 'CBB60 cylindrical sample', focus: '50% 64%', scale: 1.25 },
      { src: '/images/real/cbb61-14.jpg', alt: 'CBB61 rectangular samples', focus: '50% 65%', scale: 1.16 },
      { src: '/images/real/cbb65-2.jpg', alt: 'CBB65 metal-can sample', focus: '50% 62%', scale: 1.24 },
    ],
  },
  'single-vs-dual-run-capacitors': {
    photos: [
      { src: '/images/real/cbb65-2.jpg', alt: 'Single-run CBB65 sample marked 20 µF', focus: '50% 60%', scale: 1.22 },
      { src: '/images/real/cbb65-dual-run-7.jpg', alt: 'Dual-run CBB65 sample marked 50+5 µF', focus: '50% 62%', scale: 1.13 },
    ],
  },
  'read-motor-capacitor-label': {
    photos: [
      { src: '/images/real/cbb65-2.jpg', alt: 'Printed rating on a CBB65 sample', focus: '50% 62%', scale: 1.08 },
    ],
  },
  'capacitance-voltage-guide': {
    photos: [
      { src: '/images/real/cbb61-13.jpg', alt: 'Different capacitance ratings on CBB61 sample labels', focus: '50% 68%', scale: 1.12 },
    ],
  },
  'dimensions-terminals-mounting': {
    photos: [
      { src: '/images/real/cbb60-18.jpg', alt: 'CBB60 samples showing lead exits and a base stud', focus: '50% 62%', scale: 1.1 },
    ],
  },
  'motor-capacitor-order-shipment-checklist': {
    photos: [
      { src: '/images/real/packing-scene.jpg', alt: 'Supplied photograph of Hanxing capacitor packaging work', focus: '50% 49%' },
    ],
  },
};
