import media from './brochureMedia.generated.json';

/** Presentation assets only. Model specifications and sample evidence stay in their original datasets. */
export const brochureMedia = media;
export type BrochureMediaName = keyof typeof media;
export const findBrochureMedia = (src: string) => Object.values(media).find(image => image.src === src);
