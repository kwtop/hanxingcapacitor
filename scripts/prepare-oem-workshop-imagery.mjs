import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

// Preserve native ImageGen outputs and make responsive delivery copies.
// Input records keep the exact prompt and reference-to-output relationship.
const root = process.cwd();
const task = path.join(root, '.qa/oem-imagery-20261029');
const docs = path.join(root, 'docs/oem-imagery-20261029');
const publicDir = path.join(root, 'public/images/oem-workshop-20261029');
const sources = JSON.parse(await fs.readFile(path.join(task, 'sources.json'), 'utf8'));
const first = JSON.parse(await fs.readFile(path.join(task, 'generation-first.json'), 'utf8'));
const files = await fs.readdir(path.join(task, 'generated')).catch(() => []);
const later = await Promise.all(files.filter(name => name.endsWith('.json')).map(async name => JSON.parse(await fs.readFile(path.join(task, 'generated', name), 'utf8'))));
const repairFiles = await fs.readdir(path.join(task, 'refined')).catch(() => []);
const repairs = await Promise.all(repairFiles.filter(name => name.endsWith('.json')).map(async name => JSON.parse(await fs.readFile(path.join(task, 'refined', name), 'utf8'))));
const records = [...new Map([...first, ...later, ...repairs].map(record => [record.slug, record])).values()].sort((a, b) => a.slug.localeCompare(b.slug));
await fs.mkdir(path.join(docs, 'originals'), { recursive: true });
await fs.mkdir(publicDir, { recursive: true });
const manifest = [];
const registry = {};
for (const record of records) {
  const source = sources.find(item => item.slug === record.slug);
  if (!source) throw new Error(`Missing source: ${record.slug}`);
  const native = path.join(docs, 'originals', `${record.slug}.png`);
  await fs.copyFile(record.generatedPath, native);
  const meta = await sharp(native).metadata();
  if (Math.abs(meta.width / meta.height - 1.5) > 0.01 || meta.width < 1536) throw new Error(`Unexpected image dimensions: ${record.slug} ${meta.width}x${meta.height}`);
  const base = `/images/oem-workshop-20261029/${record.slug}`;
  for (const width of [640, 960, 1536]) {
    const dest = path.join(root, 'public', `${base}-${width}.webp`);
    await sharp(native).resize(width).webp({ quality: 88, effort: 5 }).toFile(dest);
  }
  const alt = `AI-refined illustration: ${source.alt.replace(/ in the supplied (?:video|photograph|production footage)\.?/g, '').replace(/\.$/, '')}.`;
  registry[record.slug] = {
    src: `${base}-1536.webp`,
    srcset: [640, 960, 1536].map(width => `${base}-${width}.webp ${width}w`).join(', '),
    width: 1536, height: 1024, alt,
    provenance: 'ai-refined-illustration', sourceOriginal: source.original,
  };
  manifest.push({ ...record, reference: source.original, nativeOutput: `originals/${record.slug}.png`, width: meta.width, height: meta.height,
    sourceSha256: crypto.createHash('sha256').update(await fs.readFile(source.reference)).digest('hex'),
    generatedSha256: crypto.createHash('sha256').update(await fs.readFile(native)).digest('hex'),
    publicImage: registry[record.slug].src, classification: 'AI-refined illustration; not documentary evidence' });
}
await fs.writeFile(path.join(docs, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
// Only publish a complete registry, avoiding partially updated pages.
if (records.length === sources.length) await fs.writeFile('src/data/oemWorkshopPhotography.generated.json', JSON.stringify(registry, null, 2) + '\n');
console.log(JSON.stringify({ prepared: records.length, expected: sources.length, registryPublished: records.length === sources.length }));
