import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const plan=JSON.parse(await readFile(path.join(root,'docs/site-coherence-20261019/IMAGEGEN.json'),'utf8'));
const destination=path.join(root,'public/images/previews/site-coherence-20261019');
await mkdir(destination,{recursive:true});
const records=[];
for(const asset of plan.assets){
  const metadata=await sharp(asset.output).metadata();
  const widths=[640,960,1536,2048].filter(width=>width<=metadata.width);
  for(const width of widths){
    const output=path.join(destination,`${asset.name}-${width}.webp`);
    const info=await sharp(asset.output).resize({width,withoutEnlargement:true}).webp({quality:87,effort:5}).toFile(output);
    records.push({name:asset.name,width,height:info.height,bytes:info.size,file:path.relative(root,output).replaceAll('\\','/'),method:'resize and WebP encoding of ImageGen output'});
  }
}
await writeFile(path.join(root,'docs/site-coherence-20261019/MEDIA.json'),JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify(records));
