import originals from './sourcePhotography.generated.json';
import banners from './sourceBanners.generated.json';

/** Original supplied photography / video stills, resized and encoded without new scene content. */
export const sourcePhotography = originals;
/** Product presentations edited with the four user-selected capacitor photographs as references. */
export const sourceBanners = banners;
export const findSourcePhotography = (src: string) => Object.values(originals).find(image => image.src === src);
