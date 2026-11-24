import images from './interiorPhotography.generated.json';
import { hanxingPackaging } from './hanxingPackaging';

/** Inner-page editorial photography. Original labels and documentary media remain separate. */
export const interiorPhotography = { ...images, 'packing-scene': hanxingPackaging.station };
export const findInteriorPhotography = (src: string) => src === images['packing-scene'].src
  ? hanxingPackaging.station
  : Object.values(interiorPhotography).find(image => image.src === src);
