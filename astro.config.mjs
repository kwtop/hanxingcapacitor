import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.hanxingcapacitor.com',
  output: 'server',
  integrations: [react()],
  // Concurrent builds must not replace the dev server's React JSX runtime.
  vite: {
    cacheDir: process.argv.includes('dev')
      ? `node_modules/.vite-hanxing-dev${process.env.HANXING_VISUAL_PREVIEW === 'satechi' ? '-satechi' : ''}`
      : 'node_modules/.vite-hanxing-build',
  },
  devToolbar: { enabled: false },
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
  server: { port: 4321 },
});
