export function bindCopyFeedback(button: HTMLButtonElement | null, template: HTMLElement | null, status: HTMLElement | null, copied: string, fallback: string) {
  if(!button || !template || !status || button.dataset.copyReady) return;
  button.dataset.copyReady='true';
  const label=button.textContent || 'Copy';
  let failNext=import.meta.env.DEV && new URLSearchParams(location.search).get('ui-state')==='document-copy-error';
  button.addEventListener('click',async()=>{
    if(button.disabled)return;
    button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Copying…';status.textContent='';
    try{
      if(failNext){failNext=false;throw new Error('Local preview clipboard failure');}
      await navigator.clipboard.writeText(template.textContent || '');status.textContent=copied;
    }catch{
      const range=document.createRange();range.selectNodeContents(template);
      const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);
      template.focus({preventScroll:true});status.textContent=fallback;
    }finally{button.disabled=false;button.removeAttribute('aria-busy');button.textContent=label;}
  });
}
