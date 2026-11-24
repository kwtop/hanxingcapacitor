import assets from './guidePhotoRetouch.generated.json';

export type GuidePhotoRetouch = {
  src: string;
  srcset: string;
  fullSrc: string;
  width: number;
  height: number;
  originalSrc: string;
  sourceKind: string;
};

// Guide presentation only. Original files remain the source for label verification.
const photographs: Readonly<Record<string, GuidePhotoRetouch>> = assets;
export const getGuidePhotoRetouch = (source: string): GuidePhotoRetouch | undefined => photographs[source];
