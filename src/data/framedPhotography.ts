import assets from './framedPhotography.generated.json';

export type FramedPhotography = {
  slug: string;
  src: string;
  srcset: string;
  fullSrc: string;
  width: number;
  height: number;
  originalSrc: string;
  note: string;
};

// Presentation derivatives only. Labels and documentary records keep their source files.
const photographs: Readonly<Record<string, FramedPhotography>> = assets;
export const getFramedPhotography = (originalSrc: string): FramedPhotography | undefined => photographs[originalSrc];
