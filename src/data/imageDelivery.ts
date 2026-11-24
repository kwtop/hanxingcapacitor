import assets from './imageDelivery.generated.json';

export type ImageDelivery = {
  src: string; srcset: string; width: number; height: number;
  thumb: string; thumbSrcset: string; thumbWidth: number; thumbHeight: number;
  zoomSrc: string; originalSrc: string;
};
const photographs: Readonly<Record<string, ImageDelivery>> = assets;
const displayImages = new Map(Object.values(photographs).map(image => [image.src, image]));
export const getImageDelivery = (src: string): ImageDelivery | undefined => photographs[src] ?? displayImages.get(src);
export const displayImageUrl = (src: string) => getImageDelivery(src)?.src ?? src;
export const zoomImageUrl = (src: string) => getImageDelivery(src)?.zoomSrc ?? src;
