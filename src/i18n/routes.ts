import publicPaths from './publicPaths.json';
export const translatedPaths = new Set([...publicPaths, '/thank-you/']);
export const spanishPath = (path: string) => '/es' + path;
export function englishPath(path: string) { return path.startsWith('/es/') ? path.slice(3) : path; }
export function alternates(path: string, origin: string) {
  const source=englishPath(path);
  return publicPaths.includes(source) ? [
    {lang:'en',href:new URL(source,origin).href},
    {lang:'es',href:new URL(spanishPath(source),origin).href},
    {lang:'x-default',href:new URL(source,origin).href},
  ] : [];
}
