import editorialArticles from './editorialArticles.json';
import type { PhotoExample } from './guideExamples';

export type GuideLink = { label: string; href: string };
export type GuideCell = string | { text: string; href: string };
export type GuideTable = { caption: string; headers: string[]; rows: GuideCell[][] };
export type GuideSection = {
  id: string;
  aliases?: string[];
  heading: string;
  tocLabel?: string;
  paragraphs?: string[];
  citations?: { paragraph: number; label: string; href: string }[];
  diagram?: 'starting-duty';
  points?: string[];
  orderedPoints?: boolean;
  records?: { label: string; text: string }[];
  tables?: GuideTable[];
  photos?: PhotoExample[];
  photoPlacement?: 'before' | 'after';
  layout?: 'label' | 'compact-photo';
  note?: string;
  links?: GuideLink[];
  copyText?: string;
};
export type GuideLayout = { sections: GuideSection[]; details: string[]; inquiryLinks?: GuideLink[] };

/** Canonical article prose, retaining verified photos and historical section IDs. */
export const guideLayouts = Object.fromEntries(editorialArticles.map(({guide,layout})=>[guide.slug,layout])) as Record<string,GuideLayout>;
