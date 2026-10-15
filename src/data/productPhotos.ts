export type ProductGalleryPhoto = { src: string; thumb?: string; label: string; alt: string };

export const productPhotos: Record<string, ProductGalleryPhoto[]> = {
  CBB60: [
    { src: '/images/real/cbb60-hanxing-wired.jpg', label: '35 µF · 450 VAC wired sample', alt: 'Photograph of a Hanxing-marked CBB60 sample labelled 35 µF and 450 VAC, with two insulated leads.' },
    { src: '/images/real/cbb60-17.jpg', label: 'Wired sample', alt: 'Photograph of a CBB60 sample with several coloured leads.' },
    { src: '/images/real/cbb60-16.jpg', label: 'Cylindrical body and lead exit', alt: 'Photograph of a cylindrical CBB60 capacitor sample with an insulated lead.' },
    { src: '/images/real/cbb60-18.jpg', label: 'Base stud and lead clearance', alt: 'Photograph of two CBB60 samples showing leads and a threaded base stud.' },
  ],
  CBB61: [
    { src: '/images/real/cbb61-13.jpg', label: '4.5 / 5 / 6 µF · 450 VAC samples', alt: 'Photograph of three rectangular CBB61 samples labelled 4.5, 5 and 6 µF at 450 VAC, with blade terminals.' },
    { src: '/images/real/cbb61-14.jpg', label: 'Different case and rating examples', alt: 'Photograph of several CBB61 rectangular capacitor samples.' },
    { src: '/images/real/cbb61-leads-10.jpg', label: 'Wire-lead housings', alt: 'Photograph of two CBB61 capacitor samples with red wire leads.' },
  ],
  CBB65: [
    { src: '/images/real/cbb65-2.jpg', label: '20 µF · 450 VAC sample', alt: 'Photograph of a CBB65 metal-can capacitor sample marked 20 µF and 450 VAC, with its terminal end visible.' },
    { src: '/images/real/cbb65-4.jpg', label: 'Sample and carton', alt: 'Photograph of a CBB65 capacitor sample beside a printed carton.' },
    { src: '/images/real/cbb65-dual-run-7.jpg', label: 'Dual-run 50+5 µF sample', alt: 'Photograph of a CBB65 dual-run capacitor sample marked 50+5 µF and 450 VAC.' },
  ],
  CD60: [
    { src: '/images/real/cd60-25.jpg', label: '500 µF · 300 VAC sample', alt: 'Photograph of a cylindrical CD60 motor-start capacitor sample marked 500 µF and 300 VAC.' },
    { src: '/images/real/cd60-detail-69.jpg', label: 'Rating and terminal view', alt: 'Photograph of a CD60 sample showing its printed rating and blade terminals.' },
  ],
};
