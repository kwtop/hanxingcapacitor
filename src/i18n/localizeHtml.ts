import {load} from 'cheerio';
import type {AnyNode} from 'domhandler';
import dictionary from './es.generated.json';
import ui from './es-ui.json';
import reactUi from './es-react-ui.generated.json';
import extra from './es-extra.json';
import {translatedPaths} from './routes';
import esMetadata from './es-metadata.json';
import {localizeSchema,readableKeys} from './localizeSchema';
const messages:Record<string,string>={...dictionary,...reactUi,...ui,...extra};
const normalize=(s:string)=>s.replace(/\s+/g,' ').trim();
export function spanishText(s:string):string {
  const text=normalize(s);
  const translated=messages[text]??(text.startsWith('/ ')?'/ '+spanishText(text.slice(2)):undefined);
  return translated ? (s.match(/^\s*/)?.[0]||'')+translated+(s.match(/\s*$/)?.[0]||'') : s;
}
export function spanishHref(value:string) {
  if(!value||value.startsWith('#')||/^(?:mailto:|tel:)/.test(value))return value;
  const url=new URL(value,'https://www.hanxingcapacitor.com');
  if(!['www.hanxingcapacitor.com','hanxingcapacitor.com'].includes(url.hostname))return value;
  return translatedPaths.has(url.pathname)?'/es'+url.pathname+url.search+url.hash:value;
}
export function localizeHtml(html:string,sourcePath:string) {
  const $=load(html,{scriptingEnabled:false});
  function walk(node:AnyNode) {
    const parentName=node.parent&&'name'in node.parent?node.parent.name:'';
    if(node.type==='text'&&!['script','style'].includes(parentName))node.data=parentName==='code'?node.data.split('\n').map(spanishText).join('\n'):spanishText(node.data);
    for(const child of 'children' in node?node.children:[])walk(child);
  }
  walk($.root()[0]);
  $('html').attr('lang','es');
  $('*').each((_,node)=>{
    const element=$(node);
    for(const key of ['alt','aria-label','placeholder','title','data-noun']){
      const value=element.attr(key);if(value)element.attr(key,spanishText(value));
    }
  });
  $('a[href]').each((_,node)=>{
    const element=$(node);if(!element.closest('[data-language-switch]').length)element.attr('href',spanishHref(element.attr('href')!));
  });
  $('form[action]').each((_,node)=>{const el=$(node);if((el.attr('method')||'get').toLowerCase()==='get')el.attr('action',spanishHref(el.attr('action')!));});
  // Compact option labels remain fully readable beside the Spanish inquiry CTA.
  const seriesLabels:Record<string,string>={CBB60:'CBB60 · Marcha',CBB61:'CBB61 · Ventiladores',CBB65:'CBB65 · Climatización',CD60:'CD60 · Arranque'};
  $('.su-inquiry option').each((_,node)=>{const label=seriesLabels[$(node).attr('value')||''];if(label)$(node).text(label);});
  $('a[href="/downloads/oem-label-packing-brief.txt"]').attr('href','/downloads/es/oem-label-packing-brief.txt').attr('download','hanxing-requisitos-etiquetado-embalaje.txt');
  $('a[href="/downloads/model-document-request.txt"]').attr('href','/downloads/es/model-document-request.txt').attr('download','hanxing-solicitud-documentacion-modelo.txt');
  const canonical='https://www.hanxingcapacitor.com/es'+sourcePath;
  $('link[rel="canonical"]').attr('href',canonical);
  for(const key of ['description','og:title','og:description','og:image:alt','twitter:title','twitter:description']){
    $(`meta[name="${key}"],meta[property="${key}"]`).each((_,el)=>{$(el).attr('content',spanishText($(el).attr('content')||''));});
  }
  $('meta[property="og:url"]').attr('content',canonical);
  // Spanish is intentionally country-neutral; do not assert a regional market.
  $('meta[property="og:locale"]').remove();
  $('[data-language-switch] a').each((_,el)=>{
    if($(el).attr('hreflang')==='es')$(el).attr('aria-current','page');else $(el).removeAttr('aria-current');
  });
  const runtime:Record<string,string>={...reactUi,...ui};
  function remember(value:unknown,key='') {
    if(typeof value==='string'&&readableKeys.has(key)){const text=normalize(value);if(messages[text])runtime[text]=messages[text];}
    else if(Array.isArray(value)){
      if(value.length===2&&typeof value[0]==='number')remember(value[1],key);
      else for(const item of value)remember(item,key);
    }else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))remember(v,k);
  }
  $('astro-island').each((_,node)=>{
    remember(JSON.parse($(node).attr('props')||'{}'));
    const island=$(node);island.find('*').addBack().contents().each((_,el)=>{if(el.type==='text'){const text=normalize(el.data);if(messages[text])runtime[text]=messages[text];}});
  });
  $('script[type="application/ld+json"]').each((_,node)=>{$(node).text(JSON.stringify(localizeSchema(JSON.parse($(node).text()),{
    sourcePath, modifiedAt:(esMetadata.pageModifiedAt as Record<string,string>)[sourcePath]||esMetadata.modifiedAt,
    translatedPaths, translate:spanishText,
  })).replace(/</g,'\\u003c'));});
  // Contact context records are display strings; object keys, photo IDs and
  // product codes retain the API's existing values.
  for(const attr of ['data-configurations','data-photo-references','data-guides'])$('['+attr+']').each((_,node)=>{
    function context(v:unknown):unknown {
      if(typeof v==='string')return spanishText(v);
      if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,context(x)]));
      return v;
    }
    $(node).attr(attr,JSON.stringify(context(JSON.parse($(node).attr(attr)!))));
  });
  $('head').append(`<script id="hx-locale-messages" type="application/json">${JSON.stringify(runtime).replace(/</g,'\\u003c')}</script>`);
  return $.html();
}
