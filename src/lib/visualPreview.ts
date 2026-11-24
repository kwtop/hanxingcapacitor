/** The site study is available only in an explicitly started local dev server. */
export const isSatechiPreview = import.meta.env.DEV && process.env.HANXING_VISUAL_PREVIEW === 'satechi';

/** The selected public design is independent of the historical local study flag. */
export const isSundayRoute = (pathname: string) => !/^\/(previews|visual-directions|typography-preview|interaction-preview)/.test(pathname);
export const usesEditorialPresentation = (pathname: string) => isSundayRoute(pathname) || isSatechiPreview;
