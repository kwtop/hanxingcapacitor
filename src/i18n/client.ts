// Only the current page's interactive strings are sent to the browser.
// Prose stays in server-rendered HTML; no translation request or DOM observer.
import publicPaths from './publicPaths.json';
const paths = new Set([...publicPaths, '/thank-you/']);
let messages: Record<string,string> | undefined;
export const isSpanish = () => typeof document !== 'undefined' && document.documentElement.lang === 'es';
const normalized=(value:string)=>value.replace(/\s+/g,' ').trim();
export function t(value:string):string {
  if(!isSpanish()||!value)return value;
  messages ??= JSON.parse(document.getElementById('hx-locale-messages')?.textContent || '{}');
  const text=normalized(value);const direct=messages?.[text];
  if(direct)return (value.match(/^\s*/)?.[0]||'')+direct+(value.match(/\s*$/)?.[0]||'');
  let match;
  const patterns:[RegExp,string][]=[
    [/^Enlarge (.+)$/,'Ampliar: '],[/^Expand (.+)$/,'Desplegar '],[/^Collapse (.+)$/,'Plegar '],
    [/^Play (.+)$/,'Reproducir: '],[/^Replay (.+)$/,'Repetir: '],[/^Loading (.+)$/,'Cargando: '],[/^Retry (.+)$/,'Reintentar: '],
    [/^Sample reference: (.+)$/,'Referencia de muestra: '],[/^Photograph: (.+)$/,'Fotografía: '],[/^Application: (.+)$/,'Aplicación: '],
    [/^Guide: (.+)$/,'Guía: '],[/^Request: (.+)$/,'Solicitud: '],[/^Series: (.+)$/,'Serie: '],
    [/^Return to (CBB6[015]|CD60)$/,'Volver a '],
  ];
  for(const [regex,prefix]of patterns)if((match=text.match(regex)))return prefix+t(match[1]);
  if((match=text.match(/^Select photograph (\d+): (.+)$/)))return `Seleccionar fotografía ${match[1]}: ${t(match[2])}`;
  if((match=text.match(/^View photograph (P\d+): (.+)$/)))return `Ver fotografía ${match[1]}: ${t(match[2])}`;
  if((match=text.match(/^(CBB6[015]|CD60) product view$/)))return `Vista del producto ${match[1]}`;
  if((match=text.match(/^(CBB6[015]|CD60) sample photographs$/)))return `Fotografías de muestras ${match[1]}`;
  if((match=text.match(/^View (CBB6[015]|CD60) details$/)))return `Ver detalles del ${match[1]}`;
  if((match=text.match(/^(CBB6[015]|CD60) published series ranges$/)))return `Intervalos publicados de la serie ${match[1]}`;
  if((match=text.match(/^(Run|Start) duty$/)))return match[1]==='Run'?'Servicio de marcha':'Servicio de arranque';
  if((match=text.match(/^(Run|Start|Motor run|Motor start|Fan run|HVAC run) capacitor$/)))return `${t(match[1])}: condensador`;
  if((match=text.match(/^(P\d{3} · )(.+)$/)))return match[1]+t(match[2]);
  if((match=text.match(/^(.+) Reference: (.+)$/)))return `${t(match[1])} Referencia: ${match[2]}`;
  if((match=text.match(/^Configuration ID: (.+)$/)))return `ID de configuración: ${match[1]}`;
  if((match=text.match(/^Photograph ID: (.+)$/)))return `ID de fotografía: ${match[1]}`;
  return value;
}
export function localHref(value:string):string {
  if(!isSpanish()||!value||value.startsWith('#')||/^(?:mailto:|tel:)/.test(value))return value;
  const url=new URL(value,typeof location==='undefined'?'https://www.hanxingcapacitor.com':location.href);
  if(!['www.hanxingcapacitor.com','hanxingcapacitor.com',typeof location==='undefined'?'':location.hostname].includes(url.hostname))return value;
  return paths.has(url.pathname)?'/es'+url.pathname+url.search+url.hash:value;
}
export function initLanguageLinks(){
  document.addEventListener('click',event=>{
    const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('[data-language-switch] a[href]'):null;
    if(!link)return;
    const url=new URL(link.href);url.search=location.search;url.hash=location.hash;link.href=url.href;
  });
}
