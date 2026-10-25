import {cp,mkdir,mkdtemp,readFile,readdir,rm,symlink,writeFile} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
const root=fileURLToPath(new URL('../',import.meta.url)),staging=await mkdtemp(join(tmpdir(),'hanxing-pages-build-')),output=join(root,'.cloudflare-site'),stagedOutput=join(staging,'dist');
// Build outside the live workspace to avoid restarting its development server.
// Astro moves its intermediate assets with rename(), so keep output on the staging drive.
try {
const run=(args)=>new Promise((resolveRun,reject)=>{const child=spawn(process.execPath,args,{cwd:staging,stdio:'inherit',windowsHide:true,env:{...process.env,CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV:'false'}});child.on('exit',code=>code===0?resolveRun():reject(new Error(`Build command failed (${code}).`)));});
await cp(join(root,'src'),join(staging,'src'),{recursive:true});
for(const directory of ['api','admin']){const target=join(staging,'src','pages',directory);if(!resolve(target).startsWith(resolve(staging)+sep))throw new Error('Unsafe source target');await rm(target,{recursive:true,force:true});}
await cp(join(root,'public'),join(staging,'public'),{recursive:true,filter:path=>!/(?:^|[\\/])home-directions-/.test(path)});
await cp(join(root,'package.json'),join(staging,'package.json'));await cp(join(root,'tsconfig.json'),join(staging,'tsconfig.json'));await cp(join(root,'tokens.css'),join(staging,'tokens.css'));
for(const name of ['PRODUCT-PHOTO-SOURCES.json','REAL-MEDIA-SOURCES.json'])await cp(join(root,name),join(staging,name));
await symlink(join(root,'node_modules'),join(staging,'node_modules'),process.platform==='win32'?'junction':'dir');
await writeFile(join(staging,'src','lib','visualPreview.ts'),'export const isSatechiPreview = true;\n');
async function staticEndpoints(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory())await staticEndpoints(path);else if(/\.(ts|astro)$/.test(path)){const source=await readFile(path,'utf8');if(source.includes('export const prerender = false'))await writeFile(path,source.replaceAll('export const prerender = false','export const prerender = true'));}}}
await staticEndpoints(join(staging,'src','pages'));
const site=process.env.PUBLIC_SITE_URL||'https://hanxing-capacitor-preview.pages.dev';
await writeFile(join(staging,'astro.config.mjs'),`import {defineConfig} from 'astro/config';import react from '@astrojs/react';export default defineConfig({site:${JSON.stringify(site)},output:'static',outDir:${JSON.stringify(stagedOutput)},integrations:[react()],vite:{cacheDir:${JSON.stringify(join(root,'node_modules','.vite-hanxing-pages-backend'))}},devToolbar:{enabled:false},trailingSlash:'always'});\n`);
await run([join(root,'node_modules','astro','bin','astro.mjs'),'build']);
// Replace only the verified generated output, after a successful build.
for(const target of [join(root,'.cloudflare-site-build'),output]){const absolute=resolve(target);if(!absolute.startsWith(resolve(root)+sep)||!['.cloudflare-site-build','.cloudflare-site'].includes(relative(root,absolute)))throw new Error('Unsafe build target');await rm(absolute,{recursive:true,force:true});}
await mkdir(output,{recursive:true});
await cp(stagedOutput,output,{recursive:true});
await writeFile(join(output,'_routes.json'),JSON.stringify({version:1,include:['/api/*','/admin','/admin/*'],exclude:[]},null,2));
await writeFile(join(output,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  X-Content-Type-Options: nosniff\n/admin-assets/*\n  Cache-Control: public, max-age=300\n');
await writeFile(join(output,'_redirects'),'/es/* /:splat 301\n/ar/* /:splat 301\n/certificates/ /factory/#model-records 301\n/case-studies/ /applications/ 301\n/markets/ /buying-guide/ 301\n/request-a-quote/ /contact/ 301\n');
console.log('已构建 Pages 静态网站。functions/ 将在 Pages 发布时编译。当前产物保持 noindex；没有发布。');
} finally {
if(!resolve(staging).startsWith(resolve(tmpdir())+sep)||!relative(tmpdir(),staging).startsWith('hanxing-pages-build-'))throw new Error('Unsafe temporary build path');
await rm(staging,{recursive:true,force:true});
}
