export function initVideoFeedback() {
  const preview=import.meta.env.DEV ? new URLSearchParams(location.search).get('ui-state') : '';
  document.querySelectorAll<HTMLElement>('.video-figure').forEach((figure,index)=>{
    const frame=figure.querySelector<HTMLElement>('.video-frame');
    const video=figure.querySelector<HTMLVideoElement>('video');
    const play=figure.querySelector<HTMLButtonElement>('.video-start');
    const cancel=figure.querySelector<HTMLButtonElement>('.video-cancel');
    const status=figure.querySelector<HTMLElement>('.video-status');
    const file=figure.querySelector<HTMLAnchorElement>('[data-video-file]');
    if(!frame || !video || !play || !cancel || !status || !file || frame.dataset.ready)return;
    frame.dataset.ready='true';
    const label=video.getAttribute('aria-label') || 'footage';
    let attempt=0;
    function message(text:string){status!.textContent=text;status!.hidden=!text;}
    function state(value:string){frame!.dataset.videoState=value;video!.setAttribute('aria-busy',String(value==='loading'));}
    function idle(text='') {state('idle');play!.hidden=false;play!.disabled=false;cancel!.hidden=true;file!.hidden=true;play!.querySelector('span')!.textContent='Play footage';play!.setAttribute('aria-label',`Play ${label}`);message(text);}
    function loading(){state('loading');play!.disabled=true;play!.querySelector('span')!.textContent='Loading footage…';cancel!.hidden=false;file!.hidden=true;message('Loading footage…');}
    function failed(){state('error');play!.hidden=false;play!.disabled=false;cancel!.hidden=true;file!.hidden=false;play!.querySelector('span')!.textContent='Retry footage';play!.setAttribute('aria-label',`Retry ${label}`);message('Footage could not be played. Retry, or open the video file.');}
    play.addEventListener('click',async()=>{
      if(play.disabled)return;
      const current=++attempt;
      if(frame.dataset.videoState==='error')video.load();
      video.controls=true;video.tabIndex=0;loading();
      try{await video.play();}catch{if(current===attempt)failed();}
    });
    cancel.addEventListener('click',()=>{attempt++;idle('Playback cancelled.');video.pause();video.preload='none';video.load();video.controls=false;video.tabIndex=-1;play.focus();});
    video.addEventListener('playing',()=>{state('playing');play.hidden=true;play.disabled=false;cancel.hidden=true;file.hidden=true;message('Playing footage.');if(document.activeElement===play || document.activeElement===cancel)video.focus({preventScroll:true});});
    video.addEventListener('waiting',()=>{if(!video.paused){state('loading');cancel.hidden=false;message('Buffering footage…');}});
    video.addEventListener('pause',()=>{if(frame.dataset.videoState==='playing' || frame.dataset.videoState==='loading'){state('paused');cancel.hidden=true;message('Footage paused.');}});
    video.addEventListener('ended',()=>{state('ended');play.hidden=false;play.disabled=false;play.querySelector('span')!.textContent='Replay footage';play.setAttribute('aria-label',`Replay ${label}`);cancel.hidden=true;message('Footage ended.');});
    video.addEventListener('error',()=>{attempt++;failed();});
    idle();
    if(index===0 && preview==='video-error')failed();
    if(index===0 && preview==='video-loading')loading();
  });
}
