// Read-only initial-HTML SEO audit. No deployment, indexing submission or inquiry sending.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
const [base, expected, ...options] = process.argv.slice(2);
if (!base || !expected) throw new Error('Usage: npm run check:release -- <candidate URL> <expected public origin> [--output=report.json]');
const origin = new URL(expected).origin;
if (!origin.startsWith('https://') || /localhost|127\.0\.0\.1/.test(origin)) throw new Error('Public origin must be an HTTPS domain');
const errors=[], warnings=[], pages=[], cache=new Map(), assets=new Set(), edges=new Map(), titles=new Set(), descriptions=new Set();
const request=async (path,headers={})=>{const r=await fetch(new URL(path,base),{redirect:'manual',headers,signal:AbortSignal.timeout(15000)});return {status:r.status,headers:Object.fromEntries(r.headers),html:await r.text()};};
const get=async path=>{if(!cache.has(path)) cache.set(path,await request(path));const r=cache.get(path);if(r.status!==200) errors.push(`${path}: HTTP ${r.status}`);return r;};
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3])]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'gi'))].map(m=>attrs(m[0]));
const meta=(html,name)=>tags(html,'meta').find(a=>a.name===name||a.property===name)?.content;
const locs=xml=>[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>decode(m[1]));
const noindex=r=>/noindex/i.test(meta(r.html,'robots')||'')||/noindex/i.test(r.headers['x-robots-tag']||'');
const sitemap=await get('/sitemap.xml'), urls=locs(sitemap.html);
if(!sitemap.headers['content-type']?.includes('xml')||!sitemap.html.includes('<urlset')) errors.push('sitemap.xml must be XML');
if(!urls.length||new Set(urls).size!==urls.length) errors.push('Empty/duplicate sitemap');
const index=await get('/sitemap-index.xml');
if(!index.headers['content-type']?.includes('xml')||!index.html.includes('<sitemapindex')||!locs(index.html).includes(`${origin}/sitemap.xml`)) errors.push('Invalid sitemap index');
if((await get('/sitemap-0.xml')).html!==sitemap.html) errors.push('Legacy sitemap alias mismatch');
const robots=(await get('/robots.txt')).html;
if(/Disallow:\s*\/\s*(?:\n|$)/.test(robots)||!robots.includes('User-agent: *')||!robots.includes('Allow: /')) errors.push('robots blocks search crawlers');
if(!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) errors.push('robots sitemap mismatch');
if(/Disallow:\s*\/(?:_astro|images|videos)\//.test(robots)) errors.push('robots blocks resources');
const llms=await get('/llms.txt');
if(!llms.headers['content-type']?.includes('text/plain')||!llms.html.startsWith('# Hanxing Capacitor')) errors.push('Invalid llms.txt');
for(const url of urls){
 const u=new URL(url),path=u.pathname,r=await get(path),html=r.html;
 if(u.origin!==origin||u.search||u.hash||!path.endsWith('/')||/^\/(es|ar)\//.test(path)) errors.push(`${path}: invalid sitemap URL`);
 if(noindex(r)) errors.push(`${path}: noindex`);
 const canonical=tags(html,'link').filter(a=>a.rel==='canonical');
 if(canonical.length!==1||canonical[0].href!==url) errors.push(`${path}: canonical mismatch`);
 const title=decode(html.match(/<title>(.*?)<\/title>/s)?.[1]||''),description=meta(html,'description');
 if(!title||!description||titles.has(title)||descriptions.has(description)) errors.push(`${path}: missing/duplicate title or description`);
 titles.add(title);descriptions.add(description);
 if(title.length>75) warnings.push(`${path}: title length ${title.length}`);
 if(description?.length>200) warnings.push(`${path}: description length ${description.length}`);
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1) errors.push(`${path}: expected one static H1`);
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
 const text=decode(main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' '));
 if(text.length<180) errors.push(`${path}: thin initial HTML`);
 for(const name of ['og:title','og:description','og:url','og:image','og:image:alt','og:site_name','twitter:card','twitter:image']) if(!meta(html,name)) errors.push(`${path}: missing ${name}`);
 if(meta(html,'og:url')!==url) errors.push(`${path}: OG URL mismatch`);
 const image=new URL(meta(html,'og:image')||origin);assets.add(image.pathname);
 if(image.origin!==origin) errors.push(`${path}: image origin mismatch`);
 if(tags(html,'link').some(a=>a.hreflang)) errors.push(`${path}: unwanted language alternate`);
 const schemas=[];
 for(const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))try{const s=JSON.parse(m[1]);schemas.push(...(s['@graph']||[s]));}catch{errors.push(`${path}: invalid JSON-LD`);}
 const types=schemas.flatMap(s=>[s['@type']].flat());
 for(const type of ['Organization','WebSite'])if(!types.includes(type))errors.push(`${path}: missing ${type}`);
 if(path!=='/'&&!types.includes('BreadcrumbList'))errors.push(`${path}: missing breadcrumbs`);
 if(/^\/products\/[^/]+\/$/.test(path)&&path!=='/products/photographs/'&&!types.includes('ProductGroup'))errors.push(`${path}: missing series schema`);
 if(path==='/resources/articles/'&&!types.includes('CollectionPage'))errors.push(`${path}: missing collection schema`);
 if(/^\/resources\/[^/]+\/$/.test(path)&&path!=='/resources/articles/'&&!types.includes('TechArticle'))errors.push(`${path}: missing article schema`);
 if(/"(?:offers|aggregateRating|review|hasCertification|award|legalName)"\s*:/.test(JSON.stringify(schemas)))errors.push(`${path}: unsupported commercial claim`);
 edges.set(path,tags(main,'a').filter(a=>a.href).map(a=>new URL(a.href,url)).filter(a=>a.origin===origin).map(a=>a.pathname));
 for(const image of tags(html,'img'))if(image.src){const target=new URL(image.src,url);if(target.origin===origin)assets.add(target.pathname);}
 for(const a of tags(html,'a')){
  if(!a.href||/^(mailto:|tel:|https?:\/\/wa\.me)/.test(a.href))continue;
  const target=new URL(a.href,url);
  if(target.origin===origin&&target.pathname!==path)assets.add(target.pathname);
  if(target.origin===origin&&target.pathname===path&&target.hash&&!html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`))warnings.push(`${path}: missing anchor ${target.hash}`);
 }
 pages.push({path,title,descriptionLength:description?.length,initialTextLength:text.length,schemaTypes:types,indexable:!noindex(r)});
}
const reachable=new Set(['/']),queue=['/'];while(queue.length)for(const p of edges.get(queue.shift())||[])if(!reachable.has(p)){reachable.add(p);queue.push(p);}
for(const p of pages)if(!reachable.has(p.path)&&!['/privacy-policy/','/terms/'].includes(p.path))warnings.push(`${p.path}: only shared navigation/footer discovery`);
for(const path of assets)if(!path.includes('/api/')){const r=await get(path);if(/<title>.*(?:Not Found|not found)/.test(r.html))errors.push(`${path}: soft 404`);}
for(const path of ['/thank-you/','/typography-preview/','/request-a-quote/']){if(!noindex(await get(path)))errors.push(`${path}: utility missing noindex`);if(urls.includes(origin+path))errors.push(`${path}: utility in sitemap`);}
if((await request('/seo-audit-missing-20261012/')).status!==404)errors.push('Unknown route must be HTTP 404');
let redirectCount=0;
for(const locale of ['es','ar'])for(const path of ['/','/about/','/applications/','/buying-guide/','/contact/','/factory/','/faq/','/markets/','/products/',...urls.filter(u=>/^\/products\/[^/]+\/$/.test(new URL(u).pathname)&&!u.endsWith('/photographs/')).map(u=>new URL(u).pathname),'/request-a-quote/']){
 const r=await request(`/${locale}${path}`),target=path==='/markets/'?'/buying-guide/':path==='/request-a-quote/'?'/contact/':path;
 if(r.status!==301||r.headers.location!==target)errors.push(`/${locale}${path}: invalid migration redirect`);redirectCount++;
}
for(const [path,target]of [['/certificates/','/factory/#model-records'],['/case-studies/','/applications/'],['/markets/','/buying-guide/']]){const r=await request(path);if(r.status!==301||r.headers.location!==target)errors.push(`${path}: invalid legacy redirect`);redirectCount++;}
for(const bot of ['Googlebot','bingbot','OAI-SearchBot']){const r=await request('/products/cbb60-motor-run-capacitor/',{'User-Agent':bot});if(r.status!==200||noindex(r))errors.push(`${bot}: blocked or noindex`);}
const report={checkedAt:new Date().toISOString(),base,expectedOrigin:origin,checkedPages:pages.length,checkedLinksAndImages:assets.size,migrationRedirects:redirectCount,pages,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
const output=options.find(o=>o.startsWith('--output='))?.slice(9);if(output){await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({...report,pages:undefined},null,2));if(errors.length)process.exitCode=1;
