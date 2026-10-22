import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Only resize/encode native ImageGen output; the source photographs are untouched.
const root = process.cwd();
const jobs = JSON.parse(await fs.readFile(path.join(root, 'docs/oem-imagery-20261019/GENERATED.json'), 'utf8'));
const base = '/images/previews/oem-imagery-20261019/';
await fs.mkdir(path.join(root, 'public', base), { recursive: true });
const output = {};
for (const job of jobs) {
  if (!job.nativePath) throw new Error(`Missing native output: ${job.name}`);
  const original = await sharp(job.nativePath).metadata();
  const variants = [];
  for (const width of [640, 960, 1536]) {
    const src = `${base}${job.name}-${width}.webp`;
    const info = await sharp(job.nativePath).resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(path.join(root, 'public', src));
    variants.push({ src, width: info.width, height: info.height, bytes: info.size });
  }
  const largest = variants.at(-1);
  output[job.name] = {
    src: largest.src,
    srcset: variants.map(v => `${v.src} ${v.width}w`).join(', '),
    width: largest.width,
    height: largest.height,
    original: `/images/real/${job.file}`,
    provenance: 'imagegen-source-bound-reconstruction',
    nativeWidth: original.width,
    nativeHeight: original.height,
    variants,
  };
}
await fs.writeFile(path.join(root, 'src/data/oemMedia.generated.json'), JSON.stringify(output, null, 2) + '\n');
await fs.writeFile(path.join(root, 'docs/oem-imagery-20261019/MEDIA.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(Object.entries(output).map(([name, item]) => ({ name, width: item.width, height: item.height, bytes: item.variants.at(-1).bytes }))));
