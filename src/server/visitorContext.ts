/** Store only the preferred browser language, not the entire preferences header. */
export function browserLanguage(header: string | null): string {
  const candidates = (header || '').slice(0, 1024).split(',').slice(0, 20).flatMap((part, index) => {
    const [raw, ...parameters] = part.trim().split(';');
    if (!/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(raw) || raw.length > 35) return [];
    let quality = 1;
    for (const parameter of parameters) {
      const match = /^\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*$/i.exec(parameter);
      if (!match) return [];
      quality = Number(match[1]);
    }
    if (!quality) return [];
    try { return [{ tag: Intl.getCanonicalLocales(raw)[0], quality, index }]; } catch { return []; }
  });
  candidates.sort((a, b) => b.quality - a.quality || a.index - b.index);
  return candidates[0]?.tag || 'unknown';
}

export function visitorContext(request: Request, local: boolean) {
  const cf = (request as Request & { cf?: { country?: string; city?: string } }).cf;
  const country = !local && /^[A-Z]{2}$/.test(cf?.country || '') && !['XX', 'T1'].includes(cf!.country!) ? cf!.country! : 'unknown';
  const rawCity = typeof cf?.city === 'string' ? cf.city.trim() : '';
  const city = country !== 'unknown' && rawCity.length <= 100 && /^[\p{L}\p{M}\p{N} .,'’()/\-]+$/u.test(rawCity) ? rawCity : 'unknown';
  return { country, city, browser_language: browserLanguage(request.headers.get('Accept-Language')) };
}
