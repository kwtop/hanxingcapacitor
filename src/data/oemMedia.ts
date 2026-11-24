import { sourcePhotography } from './sourcePhotography';

/** Original photographs and video stills; resizing does not invent a wider scene. */
export const oemMedia = {
  'packing-worktable': sourcePhotography['packing-table'],
  'workshop-station': sourcePhotography.inspection,
  'film-process': sourcePhotography.film,
  'winding-process': sourcePhotography.winding,
  'testing-area': sourcePhotography.testing,
  'dispatch-area': sourcePhotography.dispatch,
  'oem-label-review': sourcePhotography['cbb65-packaging'],
} as const;
export type OemMediaName = keyof typeof oemMedia;
