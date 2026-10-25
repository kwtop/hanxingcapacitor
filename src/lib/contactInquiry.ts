import {trackingContext} from './siteTracking';
type Reference={series:string;text:string};
const seriesPaths:Record<string,string>={CBB60:'cbb60-motor-run-capacitor',CBB61:'cbb61-fan-capacitor',CBB65:'cbb65-air-conditioner-capacitor',CD60:'cd60-start-capacitor'};
const purposes:Record<string,string>={quote:'A quotation',documents:'Datasheets or drawings',samples:'Samples',oem:'OEM / private label',packing:'Packing and delivery','after-sales':'Help with an existing order'};
const applications:Record<string,{name:string;slug:string}>={
  hvac:{name:'Air conditioners / HVAC',slug:'hvac-and-refrigeration'},pump:{name:'Water pumps',slug:'pumps-and-water-systems'},
  fan:{name:'Fans and blowers',slug:'fans-and-ventilation'},appliance:{name:'Washing machines',slug:'appliances-and-small-motors'},other:{name:'Other single-phase motor',slug:''},
};
for(const value of Object.values(applications))if(value.slug)applications[value.slug]=value;
export function initContactInquiry(){
  const form=document.querySelector<HTMLFormElement>('#contact-inquiry-form');if(!form)return;
  const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!,status=document.getElementById('prepare-status')!,result=document.getElementById('inquiry-result')!;
  const params=new URLSearchParams(location.search),requestedSeries=params.get('series')||'';
  const configurations:Record<string,Reference>=JSON.parse(form.dataset.configurations||'{}'),photos:Record<string,Reference>=JSON.parse(form.dataset.photoReferences||'{}'),guides:Record<string,string>=JSON.parse(form.dataset.guides||'{}');
  const configurationId=params.get('configuration')||'',photoId=params.get('photo')||'',guideId=params.get('guide')||'',applicationId=params.get('application')||'',requestId=params.get('request')||'';
  const configuration=Object.hasOwn(configurations,configurationId)?configurations[configurationId]:null,photo=Object.hasOwn(photos,photoId)?photos[photoId]:null;
  const series=Object.hasOwn(seriesPaths,requestedSeries)?requestedSeries:params.has('series')||photo?.series==='Additional samples'?'unknown':'CBB60';
  const guide=Object.hasOwn(guides,guideId)?guides[guideId]:'',application=Object.hasOwn(applications,applicationId)?applications[applicationId]:null,purpose=Object.hasOwn(purposes,requestId)?purposes[requestId]:'';
  let context:string[]=[],referenceIds:string[]=[];
  function syncReferences(){
    const selected=[...form!.querySelectorAll<HTMLInputElement>('[name=products]:checked')].map(input=>input.value);
    const hasConfiguration=!!configuration&&configuration.series===series&&selected.includes(series),hasPhoto=!!photo&&(photo.series===series&&selected.includes(series)||photo.series==='Additional samples'&&selected.includes('unknown'));
    context=[hasConfiguration?`Sample reference: ${configuration!.text}`:'',hasPhoto?`Photograph: ${photo!.text}`:'',application?`Application: ${application.name}`:'',guide?`Guide: ${guide}`:'',purpose?`Request: ${purpose}`:''].filter(Boolean);
    referenceIds=[hasConfiguration?`Configuration ID: ${configurationId}`:'',hasPhoto?`Photograph ID: ${photoId}`:''].filter(Boolean);
    document.getElementById('contact-context')!.hidden=!context.length;
    document.getElementById('contact-context-value')!.replaceChildren(...context.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    const back=document.getElementById('contact-reference-link') as HTMLAnchorElement;
    if(hasPhoto){back.href='/products/photographs/';back.textContent='Return to sample photographs';}
    else if(Object.hasOwn(seriesPaths,series)&&requestedSeries&&selected.includes(series)){back.href=`/products/${seriesPaths[series]}/${hasConfiguration?'#sample-configurations':''}`;back.textContent=`Return to ${series}`;}
    else if(guide){back.href=`/resources/${guideId}/`;back.textContent='Return to the guide';}
    else if(application?.slug){back.href=`/applications/${application.slug}/`;back.textContent='Return to the application';}
    else{back.href='/products/';back.textContent='Browse products';}
    const direct=['Hello, I have a motor capacitor inquiry.',`Series: ${selected.length?selected.map(value=>value==='unknown'?'Not sure yet':value).join(' / '):'Not sure yet'}`,...context].join('\n');
    document.querySelectorAll<HTMLAnchorElement>('[data-contact-email]').forEach(link=>link.href=`mailto:${form!.dataset.email}?subject=${encodeURIComponent('HAN XING inquiry')}&body=${encodeURIComponent(direct)}`);
    document.querySelectorAll<HTMLAnchorElement>('[data-contact-whatsapp]').forEach(link=>link.href=`https://wa.me/${form!.dataset.whatsapp}?text=${encodeURIComponent(direct)}`);
  }
  form.querySelectorAll<HTMLInputElement>('[name=products]').forEach(input=>input.checked=input.value===series);
  syncReferences();
  form.addEventListener('change',event=>{
    const input=event.target;
    if(!(input instanceof HTMLInputElement)||input.name!=='products')return;
    if(input.checked)form.querySelectorAll<HTMLInputElement>('[name=products]').forEach(option=>{if(input.value==='unknown'&&option!==input||input.value!=='unknown'&&option.value==='unknown')option.checked=false;});
    syncReferences();
  });
  let formToken='',turnstileToken='',widgetId='',lastBody='',idempotencyKey=crypto.randomUUID(),busy=false;
  async function configure(){
    try{
      const response=await fetch('/api/public-config/',{credentials:'same-origin',signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('unavailable');
      const config=await response.json();formToken=config.formToken;
      if(config.siteKey){
        const render=()=>{if(!window.turnstile)return;widgetId=window.turnstile.render(document.getElementById('inquiry-verification')!,{sitekey:config.siteKey,action:'inquiry',callback:(value:string)=>{turnstileToken=value;button.disabled=false;},'expired-callback':()=>{turnstileToken='';button.disabled=true;},'error-callback':()=>{status.hidden=false;status.textContent='Verification is unavailable. Please retry or use email / WhatsApp.';}});};
        if(window.turnstile)render();else{const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=render;script.onerror=()=>{status.hidden=false;status.textContent='Verification could not load. Please refresh or contact us directly.';};document.head.append(script);}
      }else button.disabled=false;
    }catch{status.hidden=false;status.textContent='Online inquiries are temporarily unavailable. Please use email or WhatsApp, or retry below.';document.getElementById('retry-inquiry-service')!.hidden=false;}
  }
  document.getElementById('retry-inquiry-service')!.addEventListener('click',()=>{status.hidden=true;document.getElementById('retry-inquiry-service')!.hidden=true;void configure();});
  let invalidBurst=false;
  form.addEventListener('invalid',()=>{if(!invalidBurst){invalidBurst=true;window.hxAnalytics?.track('form_failure',{position:'contact_form',failureCode:'validation'});setTimeout(()=>invalidBurst=false,0);}},true);
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    if(!form.reportValidity())return;
    const fields=new FormData(form),selected=fields.getAll('products').map(String);
    if(!selected.length){status.hidden=false;status.textContent='Select a product series or choose Not sure yet.';window.hxAnalytics?.track('form_failure',{position:'contact_form',failureCode:'validation'});return;}
    const payload={name:String(fields.get('name')||''),company:String(fields.get('company')||''),email:String(fields.get('email')||''),phone:String(fields.get('phone')||''),country:String(fields.get('country')||''),products:selected,message:String(fields.get('message')||''),website:String(fields.get('website')||''),context:[...context,...referenceIds].join('\n')};
    const serialized=JSON.stringify(payload);if(lastBody&&lastBody!==serialized)idempotencyKey=crypto.randomUUID();lastBody=serialized;
    busy=true;button.disabled=true;button.textContent='Sending…';status.hidden=true;
    try{
      const response=await fetch('/api/inquiries/',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({...payload,...trackingContext(),idempotencyKey,formToken,turnstileToken}),signal:AbortSignal.timeout(20000)});
      const data=await response.json();
      if(!response.ok||!data.saved){const code=String(data.code||'server');window.hxAnalytics?.track('form_failure',{position:'contact_form',failureCode:code.startsWith('captcha')?'captcha':code==='rate_limited'?'rate_limited':'server'});throw new Error(code==='validation'?'Check your contact details and enter at least 10 characters in the message.':code==='rate_limited'?'Too many attempts. Please wait before trying again.':code.startsWith('captcha')?'Verification expired. Please complete it again.':code==='form_expired'?'Please wait a moment or refresh the page before trying again.':'Your inquiry could not be saved. Please retry or contact us directly.');}
      result.hidden=false;result.textContent=`${data.duplicate?'Your inquiry has already been received.':'Your inquiry has been received.'} Reference: ${data.reference}`;result.focus();
      form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('input:not([type=checkbox]),textarea,select').forEach(input=>{input.value='';});
      lastBody='';idempotencyKey=crypto.randomUUID();
      try{sessionStorage.removeItem('hx_source_page');}catch{/* Storage is optional. */}
      // Success is recorded by the server transaction, never by the browser.
    }catch(error){status.hidden=false;status.textContent=error instanceof Error&&error.name!=='TimeoutError'&&error.name!=='AbortError'&&!(error instanceof TypeError)?error.message:'The connection was interrupted. Retry with the same details; duplicate submissions are prevented.';if(error instanceof TypeError||error instanceof Error&&['TimeoutError','AbortError'].includes(error.name))window.hxAnalytics?.track('form_failure',{position:'contact_form',failureCode:'network'});}
    finally{busy=false;button.textContent='Send inquiry';if(widgetId&&window.turnstile){turnstileToken='';window.turnstile.reset(widgetId);button.disabled=true;}else button.disabled=false;}
  });
  void configure();
}
