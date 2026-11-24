import {createRequire}from'node:module';
import{readFile,writeFile,mkdir}from'node:fs/promises';
import assert from'node:assert/strict';
const require=createRequire('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const origin=process.argv[2]||'http://127.0.0.1:4346';
const paths=JSON.parse(await readFile('src/i18n/publicPaths.json','utf8'));
const dictionary={...JSON.parse(await readFile('src/i18n/es.generated.json','utf8')),...JSON.parse(await readFile('src/i18n/es-ui.json','utf8')),...JSON.parse(await readFile('src/i18n/es-extra.json','utf8'))};
const docs='docs/spanish-localization-20261106';await mkdir(docs,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const rows=[],interactions=[],errors=[],englishLeaks=[];let requests=0;
try{
 for(const width of[390,1440]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:width===390?2:1,locale:'en-US'});
  await context.route('**/api/**',async route=>{requests++;const path=new URL(route.request().url()).pathname;await route.fulfill({status:path.includes('public-config')?200:204,contentType:'application/json',body:path.includes('public-config')?JSON.stringify({siteKey:'',formToken:'isolated-ui-token'}):''});});
  const page=await context.newPage();page.on('pageerror',error=>errors.push({width,path:page.url(),error:error.message}));
  async function goto(path){const r=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(r.status(),200,path);await page.locator('astro-island[client]').evaluateAll(async nodes=>{await Promise.all(nodes.map(n=>customElements.whenDefined('astro-island')));});}
  async function checkText(path){
   const texts=await page.locator('body').evaluate(body=>{const items=[];const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!node.parentElement.closest('script,style')){const t=node.textContent.replace(/\s+/g,' ').trim();if(t)items.push(t);}}for(const el of body.querySelectorAll('[aria-label],[placeholder],img[alt]'))for(const a of['aria-label','placeholder','alt'])if(el.getAttribute(a))items.push(el.getAttribute(a).trim());return items;});
   const leaks=texts.filter(text=>dictionary[text]&&dictionary[text]!==text);if(leaks.length)englishLeaks.push({width,path,leaks:[...new Set(leaks)]});
  }
  for(const path of paths){
   await goto('/es'+path);assert.equal(await page.locator('html').getAttribute('lang'),'es');
   const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));if(geometry.scrollWidth>width+1)errors.push({width,path,overflow:geometry});
   const h1=await page.locator('h1').innerText();await checkText(path);
   rows.push({width,path:'/es'+path,h1,...geometry});
   if(['/', '/about/','/contact/','/products/cbb65-air-conditioner-capacitor/','/resources/cbb60-water-pump-capacitor-selection/'].includes(path))await page.screenshot({path:`${docs}/es-${width}-${path==='/'?'home':path.split('/').filter(Boolean).at(-1)}.png`});
  }
  console.log(`Spanish ${width}px: ${paths.length} routes reviewed`);
  if(width===390){
   await goto('/es/');await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
   await page.getByRole('button',{name:'Desplegar Productos',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Plegar Productos',exact:true}).getAttribute('aria-expanded'),'true');
   assert.equal(await page.locator('.mobile-language-switch a[hreflang=en]').getAttribute('href'),'/');
   await checkText('mobile-menu');await page.keyboard.press('Escape');interactions.push({width,type:'Mobile navigation, Spanish submenu, English switch and Escape'});
  }
  for(const[code,slug,photo]of[['CBB60','cbb60-motor-run-capacitor','P002'],['CBB61','cbb61-fan-capacitor','P018'],['CBB65','cbb65-air-conditioner-capacitor','P029'],['CD60','cd60-start-capacitor','P038']]){
   await goto('/es/products/'+slug+'/');await page.locator('.pg-filmstrip button').nth(1).click();await page.locator('.pdr-main-photo').click();
   const dialog=page.locator('dialog.interactive-photo-viewer');await dialog.waitFor({state:'visible'});
   const href=await dialog.getByRole('link',{name:'Consultar sobre esta muestra'}).getAttribute('href');assert.ok(href.startsWith('/es/contact/?series='+code));
   assert.ok(/photo=/.test(href));assert.ok((await dialog.locator('img').getAttribute('src')).includes('.webp'));
   await checkText(slug+'-zoom');await page.keyboard.press('ArrowRight');await checkText(slug+'-next');await page.keyboard.press('Escape');
   assert.ok(await page.locator('.pdr-main-photo').evaluate(el=>el===document.activeElement));interactions.push({width,type:code+' gallery, WebP zoom, translated captions, photo inquiry and keyboard focus'});
  }
  await goto('/es/faq/');await page.getByRole('searchbox').fill('MOQ');assert.equal(await page.locator('[data-search-item]:visible').count(),1);assert.ok((await page.locator('[data-filter-count]').innerText()).startsWith('Se muestran 1'));
  await page.getByRole('searchbox').fill('cantidad minima');assert.equal(await page.locator('[data-search-item]:visible').count(),1);await checkText('FAQ-search');interactions.push({width,type:'MOQ and accent-insensitive Spanish FAQ search'});
  await goto('/es/products/');await page.getByRole('searchbox').fill('ventilador');assert.ok(await page.locator('.series-catalog article').count()>=1);await checkText('product-search');interactions.push({width,type:'Spanish product search'});
  await goto('/es/products/photographs/');await page.getByRole('button',{name:'Mostrar más fotografías',exact:true}).click();await checkText('photographs-expanded');await page.getByRole('searchbox').fill('P038');assert.equal(await page.locator('.sample-library-grid figure').count(),1);await page.locator('.sample-photo-open').click();await checkText('photograph-P038');await page.keyboard.press('Escape');interactions.push({width,type:'Photo library pagination, search and dialog'});
  await goto('/es/buying-guide/');await page.getByText('Ayuda para elegir una serie',{exact:true}).click();await page.waitForFunction(()=>!document.querySelector('astro-island[component-url*="SelectionAssistant"]')?.hasAttribute('ssr'));await page.getByRole('button',{name:'Ventiladores y sopladores',exact:true}).click();assert.ok((await page.locator('.selection-result').innerText()).includes('montaje'));await checkText('selection-assistant');interactions.push({width,type:'Spanish equipment-selection result'});
  await goto('/es/contact/?series=CD60&photo=P038');assert.ok((await page.locator('#contact-context-value').innerText()).includes('P038'));assert.ok((await page.locator('#contact-reference-link').getAttribute('href')).startsWith('/es/'));
  await page.getByRole('button',{name:'Enviar consulta',exact:true}).click();assert.equal(await page.locator('#inquiry-name').evaluate(el=>el.validationMessage),'Indique su nombre.');
  await page.locator('#inquiry-name').fill('Validación local');await page.locator('#inquiry-destination').fill('España');await page.locator('#inquiry-phone').fill('+34 600000000');await page.locator('#inquiry-message').fill('Consulta local de prueba sobre el condensador CD60 y su ciclo de arranque.');
  let attempt=0,captured;
  await page.route('**/api/inquiries/',async route=>{attempt++;captured=route.request().postDataJSON();await route.fulfill({status:attempt===1?503:201,contentType:'application/json',body:attempt===1?JSON.stringify({code:'server',saved:false}):JSON.stringify({saved:true,reference:'LOCAL-ES-ONLY'})});});
  await page.getByRole('button',{name:'Enviar consulta',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#prepare-status').textContent.includes('No se ha podido guardar'));
  await page.getByRole('button',{name:'Enviar consulta',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#inquiry-result').textContent.includes('LOCAL-ES-ONLY'));
  assert.equal(captured.language,'es');assert.ok(captured.context.includes('P038'));assert.ok((await page.locator('#inquiry-result').innerText()).startsWith('Hemos recibido su consulta. Referencia:'));
  await checkText('contact-results');interactions.push({width,type:'Spanish validation, failed/success UI, context P038 and language es; intercepted local API only'});
  await context.close();
 }
}catch(error){errors.push({error:error.stack});}finally{await browser.close();}
const result={checkedAt:new Date().toISOString(),origin,publicRouteChecks:rows.length,interactions,englishLeaks,errors,rows,mockedLocalApiRequests:requests,productionInquiryWrites:0};
await writeFile(docs+'/browser-validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,rows:undefined},null,2));if(errors.length||englishLeaks.length)process.exitCode=1;
