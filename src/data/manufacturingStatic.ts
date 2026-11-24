import images from './manufacturingProductScenes.generated.json';
import { hanxingPackaging } from './hanxingPackaging';

/** User-selected bright illustrative scenes; product shapes reference supplied sample photographs. */
export const manufacturingStatic = { ...images, packing: hanxingPackaging.station };
