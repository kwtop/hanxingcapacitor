/** Keep all existing image nodes and layouts; add a local status only when needed. */
export function initSiteImageFeedback() {
  const main=document.querySelector('main');if(!main)return;
  const seen=new WeakSet<HTMLImageElement>();
  const preview=import.meta.env.DEV ? new URLSearchParams(location.search).get('ui-state') : '';
  let first=true;
  function attach(img:HTMLImageElement){
    // React islands own their attributes and loading state throughout hydration.
    if(seen.has(img) || img.closest('astro-island, .media-feedback') || !img.alt.trim())return;
    seen.add(img);
    let host=img.parentElement;
    while(host && (host.matches('a,button,picture') || getComputedStyle(host).display==='contents'))host=host.parentElement;
    if(!host)return;
    const container=host;
    const originalOpacity=img.style.opacity;
    const originalSrc=img.getAttribute('src') || '';
    const originalSet=img.getAttribute('srcset');
    const pictureSources=[...(img.closest('picture')?.querySelectorAll('source[srcset]') || [])].map(source=>({element:source as HTMLSourceElement,srcset:source.getAttribute('srcset')!}));
    let forced=first && preview==='site-image-error' ? 'error' : first && preview==='site-image-loading' ? 'loading' : '';
    first=false;
    let overlay:HTMLSpanElement | null=null;
    let observer:ResizeObserver | null=null;
    let timer=0;let attempt=0;
    function place(){
      if(!overlay)return;
      const image=img.getBoundingClientRect(), parent=container.getBoundingClientRect();
      const left=Math.max(image.left,parent.left),top=Math.max(image.top,parent.top);
      overlay.style.left=`${left-parent.left+container.scrollLeft}px`;overlay.style.top=`${top-parent.top+container.scrollTop}px`;
      overlay.style.width=`${Math.max(0,Math.min(image.right,parent.right)-left)}px`;overlay.style.height=`${Math.max(0,Math.min(image.bottom,parent.bottom)-top)}px`;
    }
    function clear(){clearTimeout(timer);overlay?.remove();overlay=null;observer?.disconnect();observer=null;}
    function show(error:boolean){
      clear();if(!img.isConnected)return;
      if(getComputedStyle(container).position==='static')container.style.position='relative';
      overlay=document.createElement('span');overlay.className='site-image-feedback';overlay.setAttribute('role','status');
      const message=document.createElement('span');message.textContent=error ? 'Image could not load.' : 'Loading image…';overlay.append(message);
      if(error || forced==='loading'){
        const retry=document.createElement('button');retry.type='button';retry.className='media-retry';retry.textContent=forced==='loading' ? 'Load image' : 'Retry image';
        retry.addEventListener('click',()=>{
          const target=img.closest<HTMLElement>('a,button') || container;
          if(!target.matches('a,button,[tabindex]'))target.tabIndex=-1;
          target.focus({preventScroll:true});forced='';attempt++;clear();begin();
          const url=(source:string)=>{const next=new URL(source,location.href);next.searchParams.set('image-retry',String(attempt));return next.href;};
          const candidates=(srcset:string)=>srcset.split(',').map(candidate=>{const [source,...descriptor]=candidate.trim().split(/\s+/);return [url(source),...descriptor].join(' ');}).join(', ');
          pictureSources.forEach(source=>source.element.srcset=candidates(source.srcset));
          if(originalSet)img.srcset=candidates(originalSet);
          img.src=url(originalSrc);
        });overlay.append(retry);
      }
      container.append(overlay);observer=new ResizeObserver(place);observer.observe(container);observer.observe(img);place();
    }
    function begin(){img.dataset.siteImageState='loading';img.setAttribute('aria-busy','true');timer=window.setTimeout(()=>{if(img.dataset.siteImageState==='loading')show(false);},500);}
    function ready(){if(forced)return;clear();img.dataset.siteImageState='ready';img.setAttribute('aria-busy','false');img.style.opacity=originalOpacity;}
    function failed(){clearTimeout(timer);img.dataset.siteImageState='error';img.setAttribute('aria-busy','false');img.style.opacity='0';show(true);}
    img.addEventListener('load',ready);img.addEventListener('error',failed);
    if(forced==='error')failed();
    else if(forced==='loading'){begin();show(false);}
    else if(img.complete){if(img.naturalWidth)ready();else failed();}
    else{
      const visibility=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){visibility.disconnect();if(!img.complete)begin();}},{rootMargin:'100px'});
      visibility.observe(img);
      img.addEventListener('load',()=>visibility.disconnect(),{once:true});img.addEventListener('error',()=>visibility.disconnect(),{once:true});
    }
  }
  main.querySelectorAll('img').forEach(attach);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node instanceof HTMLImageElement)attach(node);else if(node instanceof HTMLElement)node.querySelectorAll('img').forEach(attach);}))).observe(main,{childList:true,subtree:true});
}
