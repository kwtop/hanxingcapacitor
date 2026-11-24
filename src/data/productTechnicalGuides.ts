import {guides} from './guides';
import {guideLayouts} from './guideLayouts';
/** Compatibility exports for the original technical-guide collection. */
export const productTechnicalGuides = guides.filter(guide=>guide.publishedAt);
export const productTechnicalGuideLayouts = Object.fromEntries(productTechnicalGuides.map(guide=>[guide.slug,guideLayouts[guide.slug]]));
