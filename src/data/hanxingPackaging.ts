// ImageGen editorial edits based on supplied Hanxing CBB65 retail and outer carton photos.
const packagingImage = (name: string, alt: string) => {
  const base = `/images/hanxing-packaging-20261103/${name}`;
  return {
    src: `${base}-1536.webp`,
    srcset: [640, 960, 1536].map(width => `${base}-${width}.webp ${width}w`).join(', '),
    width: 1536,
    height: 1024,
    alt,
  };
};

export const hanxingPackaging = {
  '25-packing-worker': packagingImage('25-packing-worker', 'Worker packing a capacitor beside flat and assembled Hanxing CBB65 boxes.'),
  '22-blue-cartons': packagingImage('22-blue-cartons', 'Blue Hanxing CBB65 outer cartons stacked and strapped on pallets.'),
  '26-boxing-table': packagingImage('26-boxing-table', 'Hanxing CBB65 individual boxes and outer cartons at a packing table.'),
  station: packagingImage('packing-station', 'Hanxing CBB65 individual boxes beside a divided shipping carton.'),
};
