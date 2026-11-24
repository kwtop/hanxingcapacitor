import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const origin = process.argv[2] || 'http://127.0.0.1:4346';
const docs = path.resolve('docs/audit-remediation-20261105');
await mkdir(docs, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const rows = [], errors = [], interactions = [], contrasts = [];
const routes = ['/', '/about/', '/contact/', '/factory/', '/factory/process-gallery/', '/products/cbb65-air-conditioner-capacitor/', '/products/cd60-start-capacitor/', '/faq/', '/resources/cbb60-capacitor-dimensions-chart/'];
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: width < 600 ? 2 : 1, isMobile: width < 600, hasTouch: width < 600 });
    const page = await context.newPage();
    const fontRequests=[];
    page.on('request',request=>{if(/\.woff2(?:\?|$)/.test(request.url()))fontRequests.push(request.url());});
    page.on('pageerror', error => errors.push({ width, url: page.url(), error: error.message }));
    for (const route of routes) {
      const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      const overflow = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(overflow.document <= width + 1, route + ' horizontal overflow at ' + width);
      rows.push({ width, route, ...overflow });
      if (route === '/about/' || route === '/factory/') {
        assert.ok(await page.locator('.su-factory-exterior img').isVisible(), route + ': factory image is missing');
      }
      if ([390,1440].includes(width) && ['/', '/about/', '/contact/', '/factory/', '/products/cbb65-air-conditioner-capacitor/'].includes(route)) {
        const height=await page.evaluate(()=>document.documentElement.scrollHeight);
        for(let y=0;y<height;y+=800) await page.evaluate(y=>window.scrollTo(0,y),y);
        await page.waitForLoadState('networkidle');
        const label=route==='/'?'home':route==='/about/'?'about':route==='/contact/'?'contact':route==='/factory/'?'factory':'cbb65';
        await page.screenshot({ path: path.join(docs, 'browser-' + width + '-' + label + '.png'), fullPage: true });
        if(route==='/about/'&&width===1440) await page.locator('#supplier-records .zi-company-layout').screenshot({path:path.join(docs,'company-information.png')});
      }
      if (route === '/' || route.includes('cbb65-air')) {
        const selector = route === '/' ? '.su-factory-heading a' : '.pdr-variant-specifications .pdr-note a';
        const link = page.locator(selector);
        await link.scrollIntoViewIfNeeded();
        const measure = () => link.evaluate(element => {
          const rgb = color => color.match(/[\d.]+/g).map(Number);
          const foreground = rgb(getComputedStyle(element).color);
          let node = element, background;
          while (node) { const c = rgb(getComputedStyle(node).backgroundColor); if (c.length < 4 || c[3] === 1) { background = c; break; } node = node.parentElement; }
          background ||= [255,255,255];
          const luminance = c => c.slice(0,3).map(v => v / 255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((n,v,i) => n + v*[.2126,.7152,.0722][i],0);
          const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
          return { foreground, background, ratio:(values[0]+.05)/(values[1]+.05) };
        });
        for (const state of ['normal','hover','focus']) {
          if (state === 'hover') await link.hover();
          if (state === 'focus') await link.focus();
          const result = await measure(); contrasts.push({ width, route, state, ...result });
          assert.ok(result.ratio >= 4.5, route + ' contrast below 4.5: ' + JSON.stringify(result));
        }
      }
      if(route==='/'&&width<600){
        assert.ok(!fontRequests.some(url=>url.includes('inter-latin')),'Homepage downloads an extra legacy font');
        await page.getByRole('button',{name:'Open menu',exact:true}).click();
        await page.getByRole('button',{name:'Expand Products',exact:true}).click();
        assert.equal(await page.locator('#mobile-menu').getByRole('link',{name:'CBB60 · Motor run',exact:true}).isVisible(),true);
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
        interactions.push({width,type:'Mobile menu, product submenu, Escape and shared-font delivery'});
      }
    }
    await page.goto(origin + '/products/cbb65-air-conditioner-capacitor/', { waitUntil: 'networkidle' });
    const strip = page.locator('.pg-filmstrip button');
    await strip.nth(1).click();
    await strip.nth(1).press('ArrowRight');
    assert.equal(await strip.nth(2).getAttribute('aria-pressed'), 'true');
    await strip.nth(2).press('Home');
    assert.equal(await strip.nth(0).getAttribute('aria-pressed'), 'true');
    await strip.nth(1).click();
    await page.locator('.pg-main').click();
    const dialog = page.locator('.interactive-photo-viewer[open]');
    await dialog.waitFor({ state: 'visible' });
    const zoom = await dialog.locator('img').getAttribute('src');
    assert.match(zoom, /-zoom\.webp$/);
    const inquiry = await dialog.locator('a').getAttribute('href');
    assert.match(inquiry, /series=CBB65&photo=P\d+/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.interactive-photo-viewer[open]').count(), 0);
    assert.equal(await page.locator('.pg-main').evaluate(el=>el === document.activeElement), true);
    const thumbs = await strip.locator('img').evaluateAll(images=>images.slice(1,4).map(image=>({url:image.currentSrc,width:image.getBoundingClientRect().width,naturalWidth:image.naturalWidth})));
    assert.ok(thumbs.every(image=>/-thumb-\d+\.webp$/.test(image.url)));
    interactions.push({ width, type: 'CBB65 gallery arrows, Home, zoom, inquiry reference and focus return', zoom, inquiry, thumbs });
    await page.goto(origin + '/faq/', { waitUntil: 'networkidle' });
    await page.getByRole('searchbox').fill('MOQ');
    await page.waitForFunction(()=>document.querySelectorAll('[data-search-item]:not([hidden])').length===1);
    const question = await page.locator('[data-search-item]:not([hidden])').textContent();
    assert.match(question, /minimum order quantity \(MOQ\)/i);
    interactions.push({ width, type: 'MOQ search', matches: 1 });
    for (const route of ['/resources/cbb61-wire-leads-blade-terminals/', '/resources/dimensions-terminals-mounting/']) {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      const photo = page.locator('[data-resource-photo*="cbb61-leads-10"]');
      assert.equal(await photo.count(), 1);
      assert.doesNotMatch(await photo.locator('img').getAttribute('alt'), /Retouched sample view/);
      await photo.click();
      const image = page.locator('.resource-photo-dialog[open] img');
      assert.match(await image.getAttribute('src'), /-zoom\.webp$/);
      await page.keyboard.press('Escape');
      interactions.push({ width, route, type: 'Original red CBB61 lossless WebP enlargement' });
    }
    await page.goto(origin + '/contact/?series=CD60&photo=P038', { waitUntil: 'networkidle' });
    assert.match(await page.locator('#contact-context-value').textContent(), /P038/);
    assert.equal(await page.locator('#inquiry-destination').getAttribute('type'), 'text');
    interactions.push({ width, type: 'CD60 P038 inquiry context and free-text country field' });
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await writeFile(path.join(docs, 'browser-verification.json'), JSON.stringify({ checkedAt: new Date().toISOString(), origin, rows, interactions, contrasts, errors }, null, 2) + '\n');
  await browser.close();
}
console.log(JSON.stringify({ viewports: [320,390,1440], routeChecks: rows.length, interactions: interactions.length, minimumContrast: Math.min(...contrasts.map(r=>r.ratio)), errors }));
