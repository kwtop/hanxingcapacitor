// Build a reviewable source ledger from the actual English static output.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {load} from 'cheerio';
const output = new URL('../.cloudflare-site/', import.meta.url);
const root = new URL('../',import.meta.url);
const xml = await readFile(new URL('sitemap.xml',output),'utf8');
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>!p.startsWith('/es/'));
const entries = new Map();
// Existing segment numbers are stable: append new English strings rather than
// shifting the numbered, editorially reviewed translations when pages change.
let previous=[];
try{previous=JSON.parse(await readFile(new URL('docs/spanish-localization-20261106/source-inventory.json',root),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const add=(text,path,kind)=>{
  text=text.replace(/\s+/g,' ').trim();
  if(!text||!/[A-Za-z]/.test(text)||/^(?:https?:|\/|mailto:|tel:|#)/.test(text)||/^[\w.-]+@[\w.-]+$/.test(text))return;
  const entry=entries.get(text)||{text,paths:[],kinds:[]};
  if(!entry.paths.includes(path))entry.paths.push(path);
  if(!entry.kinds.includes(kind))entry.kinds.push(kind);
  entries.set(text,entry);
};
const textKeys=new Set(['name','headline','description','abstract','text','caption','category','contactType','value','imageAlt','alt','label','summary','intro','tagline','note','title','prompt','answer','question']);
function deep(value,path,key=''){
  if(typeof value==='string'){if(textKeys.has(key))add(value,path,key);}
  else if(Array.isArray(value)){
    if(value.length===2&&typeof value[0]==='number')deep(value[1],path,key);
    else for(const item of value)deep(item,path,key);
  }
  else if(value&&typeof value==='object')for(const [k,x] of Object.entries(value))deep(x,path,k);
}
for(const path of [...paths,'/thank-you/']){
  const $=load(await readFile(new URL(path.slice(1)+'index.html',output),'utf8'),{scriptingEnabled:false});
  function walk(node){
    if(node.type==='text'&&!['script','style','code'].includes(node.parent?.name))add(node.data,path,'text');
    for(const child of node.children||[])walk(child);
  }
  walk($.root()[0]);
  $('*').each((_,node)=>{for(const attr of ['alt','aria-label','placeholder','title'])if(node.attribs?.[attr])add(node.attribs[attr],path,attr);});
  $('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[property="og:image:alt"],meta[name="twitter:title"],meta[name="twitter:description"]').each((_,node)=>add(node.attribs.content,path,'meta'));
  $('script[type="application/ld+json"]').each((_,node)=>deep(JSON.parse($(node).text()),path));
  $('astro-island').each((_,node)=>deep(JSON.parse(node.attribs.props||'{}'),path));
  for(const attr of ['data-configurations','data-photo-references','data-guides'])$('['+attr+']').each((_,node)=>{
    for(const value of Object.values(JSON.parse(node.attribs[attr])))if(typeof value==='string')add(value,path,attr);else deep(value,path);
  });
}
await mkdir(new URL('docs/spanish-localization-20261106/',root),{recursive:true});
await mkdir(new URL('src/i18n/',root),{recursive:true});
await writeFile(new URL('src/i18n/publicPaths.json',root),JSON.stringify(paths,null,2)+'\n');
const ordered=previous.map(entry=>entries.get(entry.text)||{...entry,paths:[]});
const seen=new Set(ordered.map(entry=>entry.text));
ordered.push(...[...entries.values()].filter(entry=>!seen.has(entry.text)));
await writeFile(new URL('docs/spanish-localization-20261106/source-inventory.json',root),JSON.stringify(ordered,null,2)+'\n');
await writeFile(new URL('docs/spanish-localization-20261106/source-lines.txt',root),ordered.map((e,i)=>`${i+1}\t${e.text}`).join('\n')+'\n');
console.log(JSON.stringify({pages:paths.length,strings:entries.size,words:[...entries.keys()].join(' ').split(/\s+/).length}));
