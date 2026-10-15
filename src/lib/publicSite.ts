/** A public build and its server must agree before allowing indexing. */
export function publicSiteReady(site: URL | undefined): boolean {
  const built = import.meta.env.PUBLIC_SITE_URL;
  const runtime = process.env.PUBLIC_SITE_URL;
  if (!built || !runtime || !site) return false;
  try {
    const buildUrl = new URL(built);
    const runtimeUrl = new URL(runtime);
    return buildUrl.protocol === 'https:' && buildUrl.origin === runtimeUrl.origin
      && buildUrl.origin === site.origin && buildUrl.pathname === '/'
      && !/^(localhost|127\.|0\.|\[::1\])/.test(buildUrl.hostname);
  } catch { return false; }
}
