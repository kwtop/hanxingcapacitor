import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {assertAdminProtection, readAdminConfig} from './admin-protection.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const npm=process.env.npm_execpath;
if(!npm)throw new Error('Use npm run build:public or npm run deploy:public.');
const args=process.argv.slice(2);
if(args.some(arg=>arg!=='--deploy'))throw new Error('Unknown publication option.');
const adminConfig=args.includes('--deploy')?await readAdminConfig():null;
if(adminConfig?.ADMIN_AUTH_MODE==='access'&&!adminConfig.ACCESS_ALLOWED_EMAILS?.trim()) {
  throw new Error('Set ACCESS_ALLOWED_EMAILS in your local wrangler.jsonc before deploying. See docs/ADMIN-SETUP.md.');
}
const env={...process.env,HANXING_PUBLIC_RELEASE:'1',PUBLIC_SITE_URL:'https://www.hanxingcapacitor.com',CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV:'false'};
const run=args=>new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,args,{cwd:root,env,stdio:'inherit',windowsHide:true});
  child.once('error',reject);
  child.once('exit',code=>code===0?resolve():reject(new Error(`Publication step failed (${code}).`)));
});

await run([npm,'run','check']);
await run([npm,'run','test:i18n']);
await run([join(root,'scripts','compile-spanish.mjs')]);
await run([join(root,'scripts','build-cloudflare.mjs')]);
await run([join(root,'scripts','check-audit-content.mjs')]);
await run([join(root,'scripts','check-spanish.mjs')]);
await run([npm,'run','test:markdown']);
if(args.includes('--deploy')){
  await run([npm,'run','test:access']);
  // Exercise protected admin and inquiry routes against isolated LOCAL D1.
  await run([npm,'run','test:pages']);
  await run([join(root,'node_modules','wrangler','bin','wrangler.js'),'pages','deploy','.cloudflare-site','--project-name=hanxing-capacitor-preview','--branch=main','--commit-dirty=true']);
  await run([join(root,'scripts','check-release.mjs'),env.PUBLIC_SITE_URL,env.PUBLIC_SITE_URL,'--output=.qa/public-release-latest.json']);
  const health=await fetch(`${env.PUBLIC_SITE_URL}/api/health`,{signal:AbortSignal.timeout(15000)});
  if(health.status!==200||!(await health.json()).ready)throw new Error('Public backend health is not ready.');
  for(const path of ['/api/admin/inquiries/','/api/admin/inquiries/export/']){
    const url=env.PUBLIC_SITE_URL+path;
    const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
    assertAdminProtection(response,url,adminConfig);
    await response.body?.cancel();
  }
}
