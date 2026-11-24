import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

// Deterministic delivery copies; never overwrite source photographs or AI edits.
const root = process.cwd();
const publicRoot = path.join(root, 'public');
const outputDir = path.join(publicRoot, 'images/webp-delivery-20261105');
const docs = path.join(root, 'docs/audit-remediation-20261105');
const inputs = new Set();
async function collect(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (/\.(?:astro|tsx?|json|css)$/.test(entry.name) && entry.name !== 'imageDelivery.generated.json') {
      const source = await fs.readFile(file, 'utf8');
      for (const match of source.matchAll(/\/images\/[^\s"'`<>${}]+?\.(?:jpe?g|png)/gi)) {
        if (await fs.stat(path.join(publicRoot, match[0])).catch(() => null)) inputs.add(match[0]);
      }
    }
  }
}
await collect(path.join(root, 'src'));
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(docs, { recursive: true });
const registry = {};
const records = [];
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
for (const url of [...inputs].sort()) {
  const file = path.join(publicRoot, url);
  const input = await fs.readFile(file);
  const meta = await sharp(input).rotate().metadata();
  const slug = path.basename(url, path.extname(url)) + '-' + hash(Buffer.from(url)).slice(0, 7);
  const base = '/images/webp-delivery-20261105/' + slug;
  const lossless = url === '/images/real/cbb61-leads-10.jpg';
  const native = await sharp(input).rotate().png().toBuffer();
  const nativeMeta = await sharp(native).metadata();
  const widths = [...new Set([480, 800, 1280, 1536].map(w => Math.min(w, nativeMeta.width)))];
  for (const width of widths) await sharp(native).resize({ width, withoutEnlargement: true }).webp({ quality: 88, lossless, effort: 4 }).toFile(path.join(publicRoot, `${base}-${width}.webp`));
  for (const width of [160, 240, 320]) await sharp(native).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(path.join(publicRoot, `${base}-thumb-${width}.webp`));
  const zoomSrc = `${base}-zoom.webp`;
  await sharp(native).webp({ lossless, quality: 92, effort: 4 }).toFile(path.join(publicRoot, zoomSrc));
  const width = widths.filter(w => w <= 1280).at(-1) || widths[0];
  registry[url] = {
    src: `${base}-${width}.webp`, srcset: widths.map(w => `${base}-${w}.webp ${w}w`).join(', '),
    width, height: Math.round(nativeMeta.height * width / nativeMeta.width),
    thumb: `${base}-thumb-240.webp`, thumbSrcset: [160, 240, 320].map(w => `${base}-thumb-${w}.webp ${w}w`).join(', '),
    thumbWidth: 240, thumbHeight: Math.round(nativeMeta.height * 240 / nativeMeta.width),
    zoomSrc, originalSrc: url,
  };
  let decodedPixelsMatch;
  if (lossless) decodedPixelsMatch = hash(await sharp(input).rotate().raw().toBuffer()) === hash(await sharp(path.join(publicRoot, zoomSrc)).raw().toBuffer());
  if (lossless && !decodedPixelsMatch) throw new Error('Lossless source-pixel check failed: ' + url);
  if (hash(await fs.readFile(file)) !== hash(input)) throw new Error('Source changed: ' + url);
  records.push({ originalSrc: url, sourceSha256: hash(input), sourceBytes: input.length, sourceWidth: meta.width, sourceHeight: meta.height, zoomSrc, zoomBytes: (await fs.stat(path.join(publicRoot, zoomSrc))).size, lossless, decodedPixelsMatch });
}
// Existing product presentation images already have responsive WebPs; add real small thumbnails.
const comparisons = JSON.parse(await fs.readFile(path.join(root, 'src/data/comparisonPhotography.generated.json'), 'utf8'));
for (const [code, image] of Object.entries(comparisons)) {
  const base = code === 'CD60' ? image.src.replace(/-\d+\.webp$/, '') : '/images/webp-delivery-20261105/presentation-' + code.toLowerCase();
  const input = await fs.readFile(path.join(publicRoot, image.src));
  for (const width of [160, 240, 320]) await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(path.join(publicRoot, `${base}-thumb-${width}.webp`));
  registry[image.src] = { ...image, thumb: `${base}-thumb-240.webp`, thumbSrcset: [160, 240, 320].map(w => `${base}-thumb-${w}.webp ${w}w`).join(', '), thumbWidth: 240, thumbHeight: Math.round(image.height * 240 / image.width), zoomSrc: image.srcset.split(',').at(-1).trim().split(' ')[0], originalSrc: image.src };
}
await fs.writeFile(path.join(root, 'src/data/imageDelivery.generated.json'), JSON.stringify(registry, null, 2) + '\n');
const storyDimensions = {};
const storyDirectory = path.join(publicRoot, 'images/workshop-stories-20261026');
for (const name of await fs.readdir(storyDirectory)) {
  if (!name.endsWith('.webp')) continue;
  const { width, height } = await sharp(path.join(storyDirectory, name)).metadata();
  storyDimensions['/images/workshop-stories-20261026/' + name] = { width, height };
}
await fs.writeFile(path.join(root, 'src/data/storyImageDimensions.generated.json'), JSON.stringify(storyDimensions, null, 2) + '\n');
// Maintain the legacy banner delivery only while that composition is selected.
const bannerSource = '/images/source-photography-20261027/banner-desktop-1672.webp';
const bannerUrl = '/images/webp-delivery-20261105/home-banner-desktop-1672.webp';
const bannerFile = path.join(root, 'src/data/sourceBanners.generated.json');
const banners = JSON.parse(await fs.readFile(bannerFile, 'utf8'));
const desktopBanner = banners['banner-desktop'];
if ([bannerSource, bannerUrl].includes(desktopBanner.src)) {
  const bannerInput = await fs.readFile(path.join(publicRoot, bannerSource));
  const bannerOutput = await sharp(bannerInput).webp({ quality: 78, effort: 4 }).toBuffer();
  await fs.writeFile(path.join(publicRoot, bannerUrl), bannerOutput);
  desktopBanner.src = bannerUrl;
  desktopBanner.srcset = desktopBanner.srcset.replace(bannerSource, bannerUrl);
  await fs.writeFile(bannerFile, JSON.stringify(banners, null, 2) + '\n');
  await fs.writeFile(path.join(docs, 'home-banner-delivery.json'), JSON.stringify({ source: bannerSource, sourceSha256: hash(bannerInput), sourceBytes: bannerInput.length, output: bannerUrl, outputBytes: bannerOutput.length, quality: 78, compositionUnchanged: true }, null, 2) + '\n');
}
await fs.writeFile(path.join(docs, 'image-sources.json'), JSON.stringify({ generatedAt: new Date().toISOString(), sourceFilesUnchanged: true, records }, null, 2) + '\n');
console.log(JSON.stringify({ sourcePhotographs: records.length, presentationThumbnails: Object.keys(comparisons).length, losslessChecks: records.filter(r => r.lossless).map(r => ({ source: r.originalSrc, pixelsIdentical: r.decodedPixelsMatch })) }));
