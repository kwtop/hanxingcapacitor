import images from './oemWorkshopPhotography.generated.json';
import { processGallery } from './processGallery';
import type { WorkshopPhoto } from './workshopPhotos';
import { hanxingPackaging } from './hanxingPackaging';

/** AI-refined scene illustrations for the OEM section. Source records stay separate. */
export const oemWorkshopImages = {
  ...images,
  '25-packing-worker': { ...images['25-packing-worker'], ...hanxingPackaging['25-packing-worker'] },
  '22-blue-cartons': { ...images['22-blue-cartons'], ...hanxingPackaging['22-blue-cartons'] },
  '26-boxing-table': { ...images['26-boxing-table'], ...hanxingPackaging['26-boxing-table'] },
};
export type OemWorkshopName = keyof typeof images;
export type OemWorkshopPhoto = WorkshopPhoto & { fullSrc: string };

export const oemWorkshopPhoto = (name: OemWorkshopName, caption: string): OemWorkshopPhoto => {
  const image = oemWorkshopImages[name];
  return {
    slug: name, caption, ...image,
    fullSrc: image.src, originalSrc: image.sourceOriginal,
    frame: 'landscape', fit: 'cover', illustrative: true,
    illustrationNote: 'AI-refined illustration',
  };
};

const flatbedImagePath = '/images/dispatch-flatbed-20261105/wrapped-pallets';
const flatbedPhoto: OemWorkshopPhoto = {
  slug: 'wrapped-pallets-flatbed',
  caption: 'Wrapped pallets on the truck',
  alt: 'Image adapted from footage of black-wrapped pallets on a red flatbed beside the factory.',
  src: `${flatbedImagePath}-800.webp`,
  srcset: `${flatbedImagePath}-480.webp 480w, ${flatbedImagePath}-800.webp 800w, ${flatbedImagePath}-1536.webp 1536w`,
  fullSrc: `${flatbedImagePath}-1536.webp`,
  width: 800,
  height: 533,
  frame: 'landscape',
  illustrative: true,
  illustrationNote: 'AI reframing of a supplied video screenshot',
};

export const oemProcessGallery = processGallery.map(chapter => ({
  ...chapter,
  photos: chapter.photos.map(photo => photo.slug === '30-truck-handover'
    ? flatbedPhoto
    : oemWorkshopPhoto(photo.slug as OemWorkshopName, photo.caption)),
}));
