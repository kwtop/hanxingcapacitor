import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import sharp from 'sharp';

const output = path.resolve('.cloudflare-site');
const docs = path.resolve('docs/audit-remediation-20261105');
const sitemap = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8');
const revisions = JSON.parse(await fs.readFile('src/data/contentRevisions.json', 'utf8'));
const esMetadata = JSON.parse(await fs.readFile('src/i18n/es-metadata.json', 'utf8'));
const guideRecords = JSON.parse(await fs.readFile('src/data/editorialArticles.json', 'utf8'));
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
for(const route of pages.filter(route=>route.startsWith('/es/')))revisions[route]=esMetadata.pageModifiedAt?.[route.slice(3)] || esMetadata.modifiedAt;
const errors = [], missingHistory = [], imageUrls = new Set();
let imageCount = 0, sourceNotes = 0, articleCount = 0;
const attr = (tag, name) => tag.match(new RegExp('(?:^|\\s)' + name + '="([^"]*)"'))?.[1];
for (const route of pages) {
  const html = await fs.readFile(path.join(output, route, 'index.html'), 'utf8');
  const graph = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1])['@graph'] || []);
  const organization = graph.find(x => x['@type'] === 'Organization');
  const facility = graph.find(x => x['@type'] === 'Place' && x['@id']?.endsWith('#manufacturing-facility'));
  if (organization?.address?.addressLocality !== 'Hangzhou' || facility?.address?.addressRegion !== 'Hebei') errors.push(route + ': company/facility addresses are mixed');
  if (route.startsWith('/es/') ? (!/Sede central — Hangzhou/.test(html)||!/Planta de fabricación — Hebei/.test(html)) : (!/Headquarters — Hangzhou/.test(html)||!/Manufacturing facility — Hebei/.test(html))) errors.push(route + ': missing visible location roles');
  if (html.includes('View original photograph')) errors.push(route + ': removed original-photo CTA returned');
  const checkReferences = value => {
    if (!value || typeof value !== 'object') return;
    if (value['@id'] && !value['@type'] && value.dateModified) errors.push(route + ': editorial date leaked into an entity reference');
    Object.values(value).forEach(checkReferences);
  };
  checkReferences(graph);
  for (const article of graph.filter(x => x['@type'] === 'TechArticle')) {
    articleCount++;
    const sourcePath = route.startsWith('/es/') ? route.slice(3) : route;
    const record = guideRecords.find(({guide}) => sourcePath === `/resources/${guide.slug}/`)?.guide;
    if (!record?.author && article.author) errors.push(route + ': unconfirmed author inferred from other metadata');
    if (record?.author && article.author?.name !== record.author.name) errors.push(route + ': author differs from confirmed credit');
    if (!record?.author) {
      const publisher = load(html)('.guide-editorial-meta a[href$="/about/#supplier-records"]');
      if (record?.hidePublisherByline && publisher.length) errors.push(route + ': unexpected visible publisher');
      if (!record?.hidePublisherByline && publisher.text().trim() !== 'Hangzhou Zebang Refrigeration Equipment Co., Ltd.') errors.push(route + ': missing visible publisher');
    }
    const missing = [];
    if (!article.datePublished) missing.push('Verified historical publication date');
    if (!article.author) missing.push('Confirmed editorial author/reviewer record');
    if (missing.length) missingHistory.push({ path: route, title: article.headline, missing });
  }
  const pageSourceNotes = (html.match(/class="scene-source-note"/g) || []).length;
  sourceNotes += pageSourceNotes;
  if (pageSourceNotes) errors.push(route + ': removed image source label returned');
  for (const tag of html.match(/<(?:img|source|video|a|button)\b[^>]*>/g) || []) {
    for (const name of ['src', 'poster', 'data-resource-photo', 'href']) {
      const url = attr(tag, name);
      if (url && /\.(?:jpe?g|png)(?:[?#]|$)/i.test(url)) errors.push(route + ': raster consumer still uses ' + url);
      if (url?.startsWith('/images/') && name !== 'href') imageUrls.add(url.split('?')[0]);
    }
    if (tag.startsWith('<img') && attr(tag, 'src')) {
      imageCount++;
      if (!Number(attr(tag, 'width')) || !Number(attr(tag, 'height'))) errors.push(route + ': image dimensions missing');
    }
  }
}
for (const url of imageUrls) await fs.access(path.join(output, url));
assert.ok(!(await fs.readFile(path.join(output, 'sitemap-images.xml'), 'utf8')).match(/\.(?:jpe?g|png)</i), 'Image sitemap still uses JPG/PNG');
const publishedRevisions = Object.keys(revisions).filter(route => pages.includes(route));
assert.equal((sitemap.match(/<lastmod>/g) || []).length, publishedRevisions.length, 'Only recorded substantive edits receive lastmod');
for (const route of publishedRevisions) assert.ok(Number.isFinite(Date.parse(revisions[route])) && Date.parse(revisions[route]) <= Date.now(), 'Invalid editorial date: ' + route);
const cd60 = await fs.readFile(path.join(output, 'products/cd60-start-capacitor/index.html'), 'utf8');
assert.match(cd60, /Catalogue ranges and the photographed sample/);
assert.match(cd60, /Sample P038/);
const sources = JSON.parse(await fs.readFile(path.join(docs, 'image-sources.json'), 'utf8'));
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
for (const record of sources.records) assert.equal(digest(await fs.readFile(path.join('public', record.originalSrc))), record.sourceSha256, 'Source photograph changed: ' + record.originalSrc);
const red = sources.records.find(r => r.lossless);
assert.ok(red);
assert.equal(digest(await sharp(path.join('public', red.originalSrc)).rotate().raw().toBuffer()), digest(await sharp(path.join('public', red.zoomSrc)).raw().toBuffer()), 'Red CBB61 pixels changed');
const assets = JSON.parse(await fs.readFile('src/data/imageDelivery.generated.json', 'utf8'));
const thumbnails = await Promise.all(['cbb65-2.jpg', 'cbb65-4.jpg', 'cbb65-dual-run-7.jpg'].map(async name => {
  const original = '/images/real/' + name;
  const url = assets[original].thumb;
  return { original, url, bytes: (await fs.stat(path.join(output, url))).size };
}));
const thumbnailBytes = thumbnails.reduce((n, row) => n + row.bytes, 0);
assert.ok(thumbnailBytes <= 100000, 'CBB65 thumbnail budget exceeded');
const result = { checkedAt: new Date().toISOString(), pages: pages.length, images: imageCount, imageTargets: imageUrls.size, sourceNotes,
  sourceFilesPreserved: sources.records.length, redCbb61PixelsIdentical: true, cbb65Thumbnails: thumbnails, cbb65ThumbnailBytes: thumbnailBytes,
  articles: articleCount, articleHistoryPending: missingHistory, substantiveLastmodPages: publishedRevisions.length, errors };
const reportDirectory=pages.some(route=>route.startsWith('/es/'))?'docs/spanish-localization-20261106':docs;
await fs.writeFile(path.join(reportDirectory, 'content-verification.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ ...result, articleHistoryPending: missingHistory.length, cbb65Thumbnails: undefined }));
assert.deepEqual(errors, [], 'Built public content validation failed');
