// Presentation-specific copy; ratings and photographs stay in their existing source records.
import sampleLibrary from './sampleLibrary.json';
import photoSources from '../../PRODUCT-PHOTO-SOURCES.json';
import realSources from '../../REAL-MEDIA-SOURCES.json';
import { productPhotos, type ProductGalleryPhoto } from './productPhotos';

export type ReferenceGalleryPhoto = ProductGalleryPhoto & { id?: string; originalSrc?: string };
const sourceKey = (source: string) => source.slice(source.indexOf('原始素材')).replaceAll('\\', '/').toLowerCase();
const byPhotoId = new Map(photoSources.map(photo => [photo.id, photo]));
const byOriginal = new Map(photoSources.map(photo => [sourceKey(photo.original), photo]));
const originalFiles = new Map(realSources.filter(item => item.source).map(item => [sourceKey(item.source!), item.published]));
const uniqueSampleIds = new Set<string>();
const seenOriginals = new Set<string>();
for (const photo of photoSources) {
  const key = photo.sha256 || sourceKey(photo.original);
  if (!seenOriginals.has(key)) { uniqueSampleIds.add(photo.id); seenOriginals.add(key); }
}
// Only publish usable photograph metadata; local provenance paths remain server-side.
export const publicSampleLibrary = sampleLibrary.filter(photo => uniqueSampleIds.has(photo.id)).map(photo => {
  const source = byPhotoId.get(photo.id)!;
  return { ...photo, originalSrc: originalFiles.get(sourceKey(source.original)) || photo.src };
});

export function getProductGallery(code: string): ReferenceGalleryPhoto[] {
  const used = new Set<string>();
  const featured = (productPhotos[code] || []).map(photo => {
    const source = realSources.find(item => item.published === photo.src)?.source;
    const reference = source ? byOriginal.get(sourceKey(source)) : undefined;
    used.add(reference?.sha256 || photo.src);
    return { ...photo, id: reference?.id, originalSrc: photo.src, label: reference ? `${reference.id} · ${photo.label}` : photo.label };
  });
  const remaining = publicSampleLibrary.filter(photo => photo.series === code).filter(photo => {
    const key = byPhotoId.get(photo.id)!.sha256;
    if (used.has(key)) return false;
    used.add(key); return true;
  }).map(photo => ({ src: photo.src, thumb: photo.thumb, id: photo.id, originalSrc: photo.originalSrc, label: `${photo.id} · ${photo.label}`, alt: `${code} sample photograph: ${photo.label}` }));
  return [...featured, ...remaining];
}

export const seriesFormats: Record<string, { case: string; connections: string }> = {
  CBB60: { case: 'Insulated cylindrical case', connections: 'Lead wires / quick-connect terminals' },
  CBB61: { case: 'Insulated rectangular case', connections: 'Lead wires / blade terminals' },
  CBB65: { case: 'Metal can', connections: 'Model-specific terminal groups' },
  CD60: { case: 'Electrolytic start-capacitor case', connections: 'Blade terminals / wire leads' },
};

type ProductReferenceContent = {
  intro: string;
  dutyContext: string;
  detailId: string;
  fit: { title: string; text: string }[];
  applicationIntro: string;
  applications: { title: string; examples: string; href?: string }[];
  documentDimensions: string;
  documentConnections: string;
  documentDuty: string;
};
export const productReference: Record<string, ProductReferenceContent> = {
  CBB60: {
    intro: 'Cylindrical run capacitors for water pumps and single-phase motors.',
    dutyContext: 'Single-phase motors', detailId: 'cbb60-stud',
    fit: [
      { title: 'Electrical rating', text: 'Copy the µF, VAC and frequency from the original label. The horizontal sample is marked 25 µF; other CBB60 models have their own ratings and configurations.' },
      { title: 'Body and mounting stud', text: 'The horizontal sample shows a threaded base stud. Measure the body and stud separately, then compare the drawing with the available mounting space.' },
      { title: 'Lead clearance', text: 'Include the lead length and connector in your measurements. There must be room to route the leads and reach the connection.' },
    ],
    applicationIntro: 'CBB60 applications include the equipment below. The motor specification must call for a run capacitor.',
    applications: [
      { title: 'Water pumps', examples: 'Water pumps with capacitor-run motors.', href: '/applications/pumps-and-water-systems/' },
      { title: 'Washing machines', examples: 'Run-capacitor circuits in washing-machine motors.', href: '/applications/appliances-and-small-motors/' },
      { title: 'Fans and blowers', examples: 'Smoke exhaust equipment requiring this run-capacitor format.', href: '/applications/fans-and-ventilation/' },
      { title: 'Other single-phase motors', examples: 'Select the rating and connection from the motor documentation.' },
    ],
    documentDimensions: 'Body dimensions, base stud and installed clearance.',
    documentConnections: 'Lead length, connector and fixing details.',
    documentDuty: 'Model-specific life class and application requirements.',
  },
  CBB61: {
    intro: 'Compact rectangular run capacitors for fans, blowers and appliance motors.',
    dutyContext: 'Fan and appliance motors', detailId: 'cbb61-leads',
    fit: [
      { title: 'Electrical rating', text: 'Copy the original µF, VAC and frequency. The blade-terminal photo shows three individual 450 VAC samples rated 4.5, 5 and 6 µF.' },
      { title: 'Case and fixing points', text: 'Measure case length, width and height. The mounting tabs and fixing positions also need to match the drawing and the available space.' },
      { title: 'Wiring and terminals', text: 'Compare lead exit, length and connector, or the blade pattern and spacing. Parts with the same wire count can still require different wiring.' },
    ],
    applicationIntro: 'CBB61 is a run-capacitor format for fans and selected appliance motors.',
    applications: [
      { title: 'Fans and blowers', examples: 'Fan and blower motor run circuits.', href: '/applications/fans-and-ventilation/' },
      { title: 'Washing machines', examples: 'Match the original rating and rectangular case dimensions.', href: '/applications/appliances-and-small-motors/' },
      { title: 'Air-conditioner motors', examples: 'Match the motor run-capacitor rating and connection layout.', href: '/applications/hvac-and-refrigeration/#other-run-formats' },
    ],
    documentDimensions: 'Case length, width, height and mounting-tab dimensions.',
    documentConnections: 'Lead exit, length, connector and blade-terminal spacing.',
    documentDuty: 'Model-specific run duty and application requirements.',
  },
  CBB65: {
    intro: 'Single and dual-run metal-can capacitors for HVAC and refrigeration motors.',
    dutyContext: 'Single and dual-run configurations', detailId: 'cbb65-dual',
    fit: [
      { title: 'Single or dual run', text: 'The photos show a 20 µF single-run sample and a 50+5 µF dual-run sample. Each dual-run value belongs to a separate capacitance section.' },
      { title: 'Terminal groups', text: 'Send both dual-run µF values, rated VAC and a clear terminal-end photo or drawing. Each marked group must match its connection in the circuit.' },
      { title: 'Can and mounting', text: 'Use the drawing to compare can diameter, height, fixing and terminal clearance. Any certificate requested must cover the same model and configuration.' },
    ],
    applicationIntro: 'CBB65 is listed for HVAC and refrigeration motors that require run capacitors.',
    applications: [
      { title: 'Air conditioners / HVAC', examples: 'Air conditioners, compressors, refrigerated air dryers and HVAC motor systems. Identify single or dual run from the original motor documentation.', href: '/applications/hvac-and-refrigeration/' },
    ],
    documentDimensions: 'Can diameter, height, fixing and installed terminal clearance.',
    documentConnections: 'Single or dual-run configuration, with both dual-run values and terminal-group mapping.',
    documentDuty: 'Model-specific run duty and equipment requirements.',
  },
  CD60: {
    intro: 'Electrolytic start capacitors for switched single-phase AC motor circuits.',
    dutyContext: 'For a switched motor-start circuit', detailId: 'cd60-start',
    fit: [
      { title: 'Starting circuit', text: 'Provide the motor diagram and the arrangement that switches the start capacitor out. CD60 is unsuitable for continuous run duty.' },
      { title: 'Rating and duty markings', text: 'Include µF, VAC, frequency and any duty marking from the original part. This sample reads 500 µF ±5%, 300 VAC; its tolerance differs from the series data.' },
      { title: 'Case and terminals', text: 'Allow room for the case, blades or leads and their connections. Matching dimensions and µF alone cannot make a start capacitor suitable for run duty.' },
    ],
    applicationIntro: 'The applications below require a separately switched start-capacitor circuit. Check the required duty in the motor documentation.',
    applications: [
      { title: 'Water pumps', examples: 'Pump motors with a separately switched start-capacitor circuit.', href: '/applications/pumps-and-water-systems/' },
      { title: 'Air conditioners / HVAC', examples: 'Compressor motors with a separately switched start-capacitor circuit.', href: '/applications/hvac-and-refrigeration/' },
      { title: 'Other single-phase AC motor starting', examples: 'Match the rated starting time and interval between starts.' },
    ],
    documentDimensions: 'Body dimensions, terminal configuration and installed clearance.',
    documentConnections: 'Starting circuit and switching arrangement.',
    documentDuty: 'Model-specific starting duty, time limits and approved tolerance.',
  },
};
