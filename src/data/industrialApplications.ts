/** Generic equipment illustrations, not factory or customer installation records. */
export interface ApplicationIllustration {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

const root = '/images/applications/industrial-20261021/';
const illustration = (name: string, alt: string): ApplicationIllustration => ({
  src: `${root}${name}-1536.webp`,
  srcset: [600, 960, 1536].map(width => `${root}${name}-${width}.webp ${width}w`).join(', '),
  width: 1536,
  height: 1024,
  alt,
});

export const industrialApplications: Record<string, ApplicationIllustration> = {
  'pumps-and-water-systems': illustration('pump', 'Centrifugal water pump connected to an enclosed electric motor.'),
  'fans-and-ventilation': illustration('fan', 'Centrifugal ventilation blower with an enclosed electric motor.'),
  'appliances-and-small-motors': illustration('washing', 'Twin-tub washing machine in an appliance workshop.'),
  'hvac-and-refrigeration': illustration('hvac', 'Outdoor air-conditioning condensing unit.'),
};

export const applicationCover: ApplicationIllustration = {
  src: `${root}cover-2172.webp`,
  srcset: [600, 960, 1440, 2172].map(width => `${root}cover-${width}.webp ${width}w`).join(', '),
  width: 2172,
  height: 724,
  alt: 'Motor-driven equipment arranged in an industrial equipment bay.',
};

export const homeHvacPanorama: ApplicationIllustration = {
  src: `${root}hvac-wide-1536.webp`,
  srcset: [600, 960, 1536].map(width => `${root}hvac-wide-${width}.webp ${width}w`).join(', '),
  width: 1536,
  height: 614,
  alt: industrialApplications['hvac-and-refrigeration'].alt,
};

const bySource = new Map([...Object.values(industrialApplications), applicationCover, homeHvacPanorama].map(asset => [asset.src, asset]));
export const findIndustrialApplication = (src: string) => bySource.get(src);
