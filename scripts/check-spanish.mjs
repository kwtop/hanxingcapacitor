import {readFile,writeFile,access} from 'node:fs/promises';
import {load}from'cheerio';
const directory='.cloudflare-site';
const paths=JSON.parse(await readFile('src/i18n/publicPaths.json','utf8'));
const dictionary={...JSON.parse(await readFile('src/i18n/es.generated.json','utf8')),...JSON.parse(await readFile('src/i18n/es-ui.json','utf8')),...JSON.parse(await readFile('src/i18n/es-extra.json','utf8'))};
const sourceEntries=JSON.parse(await readFile('docs/spanish-localization-20261106/source-inventory.json','utf8'));
const normal=s=>s.replace(/\s+/g,' ').trim();
const tr=s=>dictionary[normal(s)]??(normal(s).startsWith('/ ')?'/ '+tr(normal(s).slice(2)):s);
const errors=[],unknown=new Map(),numericDifferences=[],rows=[];
const numbers=s=>[...s.matchAll(/[−-]?\d+(?:[.,]\d+)*/g)].map(m=>m[0].replace(/[.,]/g,'')).sort();
for(const [en,es]of Object.entries(dictionary)){
 if(JSON.stringify(numbers(en))!==JSON.stringify(numbers(es)))numericDifferences.push({en,es});
}
function texts($){const values=[];function walk(n){if(n.type==='text'&&!['script','style'].includes(n.parent?.name)){if(normal(n.data))values.push(n.data);}for(const c of n.children||[])walk(c);}walk($.root()[0]);return values;}
for(const path of [...paths,'/thank-you/']){
 const en=load(await readFile(directory+path+'index.html','utf8'),{scriptingEnabled:false}),es=load(await readFile(directory+'/es'+path+'index.html','utf8'),{scriptingEnabled:false});
 if(es('html').attr('lang')!=='es')errors.push(path+': document language');
 const enTexts=texts(en),esTexts=texts(es);
 if(enTexts.length!==esTexts.length)errors.push(path+': text nodes differ '+enTexts.length+'/'+esTexts.length);
 for(let i=0;i<Math.min(enTexts.length,esTexts.length);i++){
  const source=enTexts[i],expected=normal(source.split('\n').map(tr).join('\n')),actual=normal(esTexts[i]);
  const optionLabels={'CBB60 · Motor run':'CBB60 · Marcha','CBB61 · Fan run':'CBB61 · Ventiladores','CBB65 · HVAC run':'CBB65 · Climatización','CD60 · Motor start':'CD60 · Arranque'};
  if(expected!==actual&&optionLabels[normal(source)]!==actual)errors.push({path,source:normal(source),expected,actual});
  if(/[a-z]{3}/i.test(normal(source))&&!dictionary[normal(source)]&&normal(source)===actual&&source!=='English'&&source!=='Español'&&!/^[\w.-]+@[\w.-]+$/.test(normal(source)))unknown.set(normal(source),path);
 }
 for(const attr of ['alt','aria-label','placeholder','title']){
  const a=en('['+attr+']').toArray(),b=es('['+attr+']').toArray();if(a.length!==b.length)errors.push(path+': '+attr+' count');
  for(let i=0;i<Math.min(a.length,b.length);i++){
   const source=en(a[i]).attr(attr),actual=es(b[i]).attr(attr);if(normal(tr(source))!==normal(actual))errors.push({path,attribute:attr,source,actual});
   if(/[a-z]{3}/i.test(source)&&!dictionary[normal(source)]&&source===actual&&!/^[\w.-]+@[\w.-]+$/.test(source))unknown.set(source,path);
  }
 }
 if(paths.includes(path)){
  const origin='https://www.hanxingcapacitor.com',url=origin+'/es'+path;
  if(es('link[rel=canonical]').attr('href')!==url)errors.push(path+': canonical');
  const links=es('link[hreflang]');for(const language of ['en','es','x-default'])if(links.filter((_,el)=>es(el).attr('hreflang')===language&&es(el).attr('href')===origin+(language==='es'?'/es':'')+path).length!==1)errors.push(path+': '+language+' alternate');
  if(es('h1').length!==1)errors.push(path+': H1');
  if(!es('meta[name=robots]').attr('content')?.startsWith('index,follow'))errors.push(path+': indexability');
 }
 for(const el of es('a[href]').toArray()){
  if(es(el).closest('[data-language-switch]').length)continue;
  const href=es(el).attr('href');if(href.startsWith('#')||/^(?:mailto:|tel:)/.test(href))continue;
  const u=new URL(href,'https://www.hanxingcapacitor.com');if(u.hostname==='www.hanxingcapacitor.com'&&paths.includes(u.pathname))errors.push(path+': link leaves Spanish '+href);
  if(u.pathname.startsWith('/downloads/es/'))await access('public'+u.pathname);
 }
 const schemas=[];es('script[type="application/ld+json"]').each((_,el)=>{const data=JSON.parse(es(el).text());schemas.push(...(data['@graph']||[data]));});
 for(const node of schemas){if(['TechArticle','WebPage','AboutPage','ContactPage','CollectionPage','FAQPage','ImageGallery'].includes(node['@type'])&&node.inLanguage!=='es')errors.push(path+': schema language');}
 const website=schemas.find(node=>node['@type']==='WebSite');if(paths.includes(path)&&JSON.stringify(website?.inLanguage)!==JSON.stringify(['en','es']))errors.push(path+': shared WebSite languages');
 const organization=schemas.find(n=>n['@type']==='Organization');if(paths.includes(path)&&(organization?.name!=='Hangzhou Zebang Refrigeration Equipment Co., Ltd.'||organization?.address?.addressLocality!=='Hangzhou'))errors.push(path+': organization identity changed');
 const englishFigures=en('figure').length,spanishFigures=es('figure').length;if(englishFigures!==spanishFigures)errors.push(path+': missing figure');
 if(en('table').length!==es('table').length)errors.push(path+': missing technical table');
 rows.push({sourcePath:path,path:'/es'+path,title:es('head > title').text(),h1:es('h1').text(),paragraphs:es('main p').length,tables:es('table').length,figures:spanishFigures,initialWords:es('main').text().split(/\s+/).length,interactiveMessagesBytes:Buffer.byteLength(es('#hx-locale-messages').text())});
}
// Proper names, units and literal sample-label strings are reviewed exceptions.
const known=new Set(sourceEntries.filter(e=>dictionary[e.text]===e.text).map(e=>e.text));
const unresolved=[...unknown].filter(([s])=>!known.has(s)&&!/^© \d{4} Hangzhou Zebang/.test(s)&&!/^WhatsApp(?:[ ·+\d-]|$)/.test(s));
const report={checkedAt:new Date().toISOString(),publicPairs:paths.length,utilityPairs:1,sourceSegments:sourceEntries.length,rows,numericDifferences,unresolved:unresolved.map(([text,path])=>({text,path})),errors};
await writeFile('docs/spanish-localization-20261106/static-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,rows:undefined,validatedPagePairs:rows.length},null,2));
if(errors.length||numericDifferences.length||unresolved.length)process.exitCode=1;
