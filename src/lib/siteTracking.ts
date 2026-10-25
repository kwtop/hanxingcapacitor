type EventName = 'page_view'|'product_view'|'spec_expand'|'image_view'|'download_click'|'inquiry_click'|'whatsapp_click'|'email_click'|'form_start'|'form_failure';
type EventOptions = {product?:string;position?:string;target?:string;failureCode?:string};
type Meta = {page:string;language:string;referrer:string;utmSource:string;utmMedium:string;sourcePage:string;clientVisitorId:string;clientVisitId:string};
declare global { interface Window { hxAnalytics?: { track:(type:EventName,options?:EventOptions)=>void; context:()=>Meta }; turnstile?: {render:(node:HTMLElement,options:Record<string,unknown>)=>string;reset:(id:string)=>void} } }
const knownProducts=['CBB60','CBB61','CBB65','CD60'];
const product=()=>{const fromPath=location.pathname.match(/\/products\/(cbb60|cbb61|cbb65|cd60)-/i)?.[1].toUpperCase(),fromQuery=new URLSearchParams(location.search).get('series')||'';return fromPath||(knownProducts.includes(fromQuery)?fromQuery:'unknown');};
const safePath=(text:string)=>text.startsWith('/')&&!text.startsWith('//')?text.split(/[?#]/)[0].slice(0,240):'/';
let fallbackVisitor='',fallbackVisit='';
export function trackingContext():Meta {
  const params=new URLSearchParams(location.search);let referrer='';
  try{referrer=new URL(document.referrer).origin;}catch{/* No readable referrer. */}
  const current={referrer,utmSource:/^[a-z0-9_.-]{1,60}$/i.test(params.get('utm_source')||'')?params.get('utm_source')!:'',utmMedium:/^[a-z0-9_.-]{1,40}$/i.test(params.get('utm_medium')||'')?params.get('utm_medium')!:''};
  let sourcePage=location.pathname,attribution=current,clientVisitorId=fallbackVisitor||(fallbackVisitor=crypto.randomUUID()),clientVisitId=fallbackVisit||(fallbackVisit=crypto.randomUUID());
  try{
    const savedVisitor=JSON.parse(localStorage.getItem('hx_visitor')||'null');
    if(savedVisitor&&Date.now()-savedVisitor.lastSeen<180*86400000)clientVisitorId=savedVisitor.id;
    localStorage.setItem('hx_visitor',JSON.stringify({id:clientVisitorId,lastSeen:Date.now()}));
    const savedVisit=JSON.parse(localStorage.getItem('hx_visit')||'null');
    if(savedVisit&&Date.now()-savedVisit.lastSeen<30*60000)clientVisitId=savedVisit.id;
    localStorage.setItem('hx_visit',JSON.stringify({id:clientVisitId,lastSeen:Date.now()}));
    const saved=JSON.parse(sessionStorage.getItem('hx_attribution')||'null');
    if(saved&&Date.now()-saved.lastSeen<30*60000)attribution={referrer:saved.referrer||'',utmSource:saved.utmSource||'',utmMedium:saved.utmMedium||''};
    sessionStorage.setItem('hx_attribution',JSON.stringify({...attribution,lastSeen:Date.now()}));
    sourcePage=safePath(sessionStorage.getItem('hx_source_page')||location.pathname);
  }catch{/* Tracking must still work without storage. */}
  return {page:safePath(location.pathname),language:document.documentElement.lang||'unknown',...attribution,sourcePage,clientVisitorId,clientVisitId};
}
export function initSiteTracking(){
  if(location.pathname.startsWith('/admin')||window.hxAnalytics)return;
  let queue:Record<string,string|number>[]=[],timer:ReturnType<typeof setTimeout>|undefined,busy=false,attempts=0,formStarted=false,lastOccurredAt=0;
  trackingContext();
  const position=(element:Element)=>element.closest<HTMLElement>('[data-analytics-position]')?.dataset.analyticsPosition||
    (element.closest('header.site-header')?'navigation':element.closest('footer')?'footer':element.closest('.sp-hero,.ha-hero')?'hero':element.closest('.pdr-gallery,.photo-viewer,.zi-photo')?'product_gallery':element.closest('#inquiry-form')?'contact_form':element.closest('#specifications')?'specifications':'main');
  function track(type:EventName,options:EventOptions={}){
    try{lastOccurredAt=Math.max(Date.now(),lastOccurredAt+1);queue.push({id:crypto.randomUUID(),occurredAt:lastOccurredAt,type,page:safePath(location.pathname),language:document.documentElement.lang||'unknown',product:knownProducts.includes(options.product||'')?options.product!:product(),position:options.position||'main',target:options.target?safePath(options.target):'',failureCode:options.failureCode||''});if(queue.length>100)queue=queue.slice(-100);if(!timer)timer=setTimeout(()=>void flush(),800);}catch{/* No analytics side effects on user actions. */}
  }
  async function flush(){
    timer=undefined;if(busy||!queue.length)return;busy=true;const batch=queue.slice(0,20);
    try{const response=await fetch('/api/events/',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({...trackingContext(),events:batch}),signal:AbortSignal.timeout(6000),keepalive:true});if(!response.ok)throw new Error('not recorded');const ids=new Set(batch.map(event=>event.id));queue=queue.filter(event=>!ids.has(event.id));attempts=0;}
    catch{attempts++;}finally{busy=false;if(queue.length&&attempts<4)timer=setTimeout(()=>void flush(),Math.min(20000,1000*2**attempts));}
  }
  window.hxAnalytics={track,context:trackingContext};
  try{if(new URLSearchParams(location.search).get('hx_internal')==='1')document.cookie=`hx_internal=1; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}catch{/* Exclusion is best effort. */}
  track('page_view',{position:'page'});if(/^\/products\/(cbb60|cbb61|cbb65|cd60)-/i.test(location.pathname))track('product_view',{position:'page'});
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;if(!target)return;
    const tagged=target.closest<HTMLElement>('[data-analytics-event]');
    if(tagged){track(tagged.dataset.analyticsEvent as EventName,{position:position(tagged)});return;}
    const link=target.closest<HTMLAnchorElement>('a[href]');
    if(link){
      const href=link.getAttribute('href')||'';
      if(href.startsWith('mailto:')){track('email_click',{position:position(link)});return;}
      if(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)){track('whatsapp_click',{position:position(link)});return;}
      let url:URL;try{url=new URL(href,location.href);}catch{return;}
      if(link.hasAttribute('download')||/\.(pdf|xlsx?|docx?|zip|dxf|dwg)(?:$)/i.test(url.pathname)){track('download_click',{position:position(link),target:url.pathname});return;}
      if(url.origin===location.origin&&(/^\/(contact|request-a-quote)\/?$/.test(url.pathname)||url.hash==='#inquiry-form')){
        const series=url.searchParams.get('series')||product();track('inquiry_click',{position:position(link),product:series,target:url.pathname});try{sessionStorage.setItem('hx_source_page',safePath(location.pathname));}catch{}return;
      }
      if(url.origin===location.origin&&/#(?:specifications|single-run-specifications|dual-run-specifications)$/.test(url.hash))track('spec_expand',{position:position(link)});
    }
    if(target.closest('[data-photo-zoom]'))track('image_view',{position:'product_gallery'});
  });
  document.addEventListener('toggle',event=>{const element=event.target;if(element instanceof HTMLDetailsElement&&element.open&&(/specification|parameter/i.test(element.querySelector('summary')?.textContent||'')||element.closest('#specifications')))track('spec_expand',{position:'specifications'});},true);
  document.addEventListener('focusin',event=>{if(!formStarted&&event.target instanceof Element&&event.target.matches('input:not([type=hidden]),textarea,select')&&event.target.closest('#contact-inquiry-form')){formStarted=true;track('form_start',{position:'contact_form'});}});
  document.addEventListener('submit',event=>{if(event.target instanceof HTMLFormElement&&event.target.matches('.inquiry-callout-form')){const select=event.target.querySelector<HTMLSelectElement>('[name=series]');track('inquiry_click',{position:'inquiry_callout',product:select?.value});try{sessionStorage.setItem('hx_source_page',safePath(location.pathname));}catch{}}});
  window.addEventListener('hx:track',((event:CustomEvent<{type:EventName;options?:EventOptions}>)=>track(event.detail.type,event.detail.options)) as EventListener);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&queue.length){try{const batch=queue.slice(0,20);navigator.sendBeacon('/api/events/',new Blob([JSON.stringify({...trackingContext(),events:batch})],{type:'application/json'}));}catch{}}else if(document.visibilityState==='visible'&&queue.length&&!timer)timer=setTimeout(()=>void flush(),800);});
}
