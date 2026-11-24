import editorialArticles from './editorialArticles.json';

export type Guide = {
  slug: string;
  title: string;
  seoTitle?: string;
  category: 'Understand capacitors' | 'Compare & select' | 'Prepare your RFQ';
  summary: string;
  answer: string;
  sections: { id?: string; heading: string; paragraphs: string[]; points?: string[]; links?: { label: string; href: string }[] }[];
  inquiry: { heading: string; note: string; label: string; request: 'quote' | 'documents' };
  related: { label: string; href: string }[];
  sources: { label: string; href: string }[];
  defaultSeries?: 'CBB60' | 'CBB61' | 'CBB65' | 'CD60' | 'unknown';
  publishedAt?: string;
  hidePublisherByline?: boolean;
  /** Add only when the author and public credit have been confirmed. */
  author?: { type: 'Person' | 'Organization'; name: string; url?: string };
};

export const motorReference = { label: 'Oriental Motor: AC motor capacitor guidance', href: 'https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf' };
export const kemetDutyReference = { label: 'KEMET: MS/MD motor-start datasheet', href: 'https://yageogroup.com/content/datasheet/asset/file/KEM_A4041_MS_MD' };
export const dualRatingReference = { label: 'MARS JARD catalogue: 35/5 and 45/5 ratings', href: 'https://marsasa5515.marsdelivers.com/wps/wcm/connect/8feaf379-9c2f-4304-b4df-3f4bc48f105c/JARD%2BRun%2BCap%2BSheet-2024-4.pdf?MOD=AJPERES' };
export const dualTerminalReference = { label: 'AmRad: example dual-run terminal markings', href: "https://amradmanufacturing.com/wp-content/uploads/2025/04/TES5-Instruction-Sheet.pdf" };

/** Reviewed prose shared with the rendered sections and locale translations. */
export const guides: Guide[] = editorialArticles.map(({guide,layout})=>({
  ...guide,
  sections:layout.sections.map(section=>({id:section.id,heading:section.heading,paragraphs:section.paragraphs ?? []})),
})) as Guide[];
export const guideHref = (guide: Guide) => `/resources/${guide.slug}/`;
