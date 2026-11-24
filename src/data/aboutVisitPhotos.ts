import { workshopStorySets } from './workshopPhotos';

// These presentation images are AI retouches; the supplied photographs stay separate.
export const aboutVisitPhotos = workshopStorySets.about.map((photo) => {
  const base = `/images/about-visits-20261030/${photo.slug}`;
  return {
    slug: photo.slug,
    caption: photo.caption,
    alt: photo.alt,
    src: `${base}-960.webp`,
    srcset: [480, 720, 960, 1086].map((width) => `${base}-${width}.webp ${width}w`).join(', '),
    fullSrc: `${base}-1086.webp`,
    originalSrc: `/images/workshop-stories-20261026/${photo.slug}.webp`,
    width: 1086,
    height: 1448,
  };
});
