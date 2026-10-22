/** Enhance the existing document structure rather than copy its content into another UI. */
export function initContentSearch() {
  document.querySelectorAll<HTMLElement>('[data-content-filter]').forEach(control => {
    if(control.dataset.ready) return; control.dataset.ready='true';
    const directory=document.getElementById(control.dataset.directory || '');
    const input=control.querySelector<HTMLInputElement>('input[type="search"]');
    const count=control.querySelector<HTMLElement>('[data-filter-count]');
    const empty=control.querySelector<HTMLElement>('[data-filter-empty]');
    const clear=control.querySelector<HTMLButtonElement>('[data-filter-clear]');
    if(!directory || !input || !count || !empty || !clear) return;
    input.value=(new URLSearchParams(location.search).get('q') || '').slice(0,120);
    const items=[...directory.querySelectorAll<HTMLElement>('[data-search-item]')];
    const groups=[...directory.querySelectorAll<HTMLElement>('[data-search-group]')];
    const text=new Map(items.map(item=>[item,(item.textContent || '').toLocaleLowerCase()]));
    let searching=false;
    let opened=new Map<HTMLDetailsElement,boolean>();
    function render() {
      const tokens=input!.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const hasQuery=tokens.length>0;
      if(hasQuery && !searching) opened=new Map(items.filter((item):item is HTMLDetailsElement=>item instanceof HTMLDetailsElement).map(item=>[item,item.open]));
      let visible=0;
      items.forEach(item=>{
        const matches=tokens.every(token=>text.get(item)!.includes(token));
        item.toggleAttribute('data-filter-hidden',!matches);
        item.hidden=!matches;
        if(matches)visible++;
        if(item instanceof HTMLDetailsElement){if(hasQuery && matches)item.open=true;else if(!hasQuery && searching)item.open=opened.get(item) || false;}
      });
      groups.forEach(group=>{const hidden=!group.querySelector('[data-search-item]:not([data-filter-hidden])');group.toggleAttribute('data-filter-hidden',hidden);group.hidden=hidden;});
      searching=hasQuery;
      count!.textContent=`${visible} of ${items.length} ${control.dataset.noun} shown`;
      empty!.hidden=visible>0;clear!.hidden=!input!.value;
    }
    const updateUrl=()=>{
      const url=new URL(location.href);if(input.value)url.searchParams.set('q',input.value);else url.searchParams.delete('q');
      history.replaceState(history.state,'',url);render();
    };
    input.addEventListener('input',updateUrl);
    clear.addEventListener('click',()=>{input.value='';updateUrl();input.focus();});
    window.addEventListener('popstate',()=>{input.value=(new URLSearchParams(location.search).get('q') || '').slice(0,120);render();});
    window.addEventListener('hashchange',()=>{
      let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);
      if(target && directory.contains(target) && target.closest('[data-filter-hidden]')){input.value='';updateUrl();target.scrollIntoView();}
    });
    control.hidden=false;render();
  });
}
