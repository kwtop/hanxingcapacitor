import{createRequire}from'node:module';
import{writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const require=createRequire('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const origin=process.argv[2]||'http://127.0.0.1:4346',rows=[],errors=[];
try{
 for(const width of[320,800,1170,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push({width,error:e.message}));
  await page.route('**/api/**',r=>r.fulfill({status:204,body:''}));
  for(const path of['/','/products/cbb65-air-conditioner-capacitor/','/es/','/es/contact/','/es/resources/articles/']){
   await page.goto(origin+path,{waitUntil:'networkidle'});
   const boxes=await page.locator('header .header-inner').evaluate(root=>({width:innerWidth,scroll:document.documentElement.scrollWidth,children:[...root.children].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width).map(e=>({name:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))}));
   assert.ok(boxes.scroll<=width+1,JSON.stringify({width,path,boxes}));
   for(let i=1;i<boxes.children.length;i++){const a=boxes.children[i-1],b=boxes.children[i];if(a.bottom>b.top&&a.right>b.left+1)errors.push({width,path,headerOverlap:[a,b]});}
   assert.equal(await page.locator('html').getAttribute('lang'),path.startsWith('/es/')?'es':'en');
   rows.push({width,path,boxes});
  }
  if(width>=1170){
   await page.goto(origin+'/es/contact/?series=CD60&photo=P038#main',{waitUntil:'networkidle'});
   await page.locator('header .su-header-actions [data-language-switch] a[hreflang=en]').click();await page.waitForLoadState('networkidle');
   assert.equal(new URL(page.url()).pathname,'/contact/');assert.equal(new URL(page.url()).search,'?series=CD60&photo=P038');assert.equal(new URL(page.url()).hash,'#main');
  }
  await page.close();
 }
}catch(error){errors.push({error:error.stack});}finally{await browser.close();}
await writeFile('docs/spanish-localization-20261106/regression-validation.json',JSON.stringify({checkedAt:new Date().toISOString(),origin,rows,errors},null,2)+'\n');console.log(JSON.stringify({checks:rows.length,queryAndHashLanguageSwitch:true,errors}));if(errors.length)process.exitCode=1;
