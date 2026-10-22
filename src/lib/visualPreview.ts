/** The site study is available only in an explicitly started local dev server. */
export const isSatechiPreview = import.meta.env.DEV && process.env.HANXING_VISUAL_PREVIEW === 'satechi';
