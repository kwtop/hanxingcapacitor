import images from './comparisonPhotography.generated.json';

/** Presentation photographs edited from the supplied samples; original label evidence stays separate. */
export const comparisonPhotography = images;
export const comparisonProduct = (code: string) => images[code as keyof typeof images];
export const findComparisonPhotography = (src: string) => Object.values(images).find(image => image.src === src);
