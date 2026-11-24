import media from './innerEditorial.generated.json';

/** Responsive inner-page presentations derived from the user's selected sample photographs.
 * Original label photographs, technical records and the homepage stay separate. */
export const innerEditorial = media;
export const findInnerEditorial = (src: string) => Object.values(media).find(asset => asset.src === src);
