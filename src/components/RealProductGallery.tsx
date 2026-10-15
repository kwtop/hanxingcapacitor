import {useState,useRef} from 'react';
import type {ProductGalleryPhoto} from '../data/productPhotos';
export default function RealProductGallery({photos,code}:{photos:ProductGalleryPhoto[];code:string}){
 const [active,setActive]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);
 const thumbs=useRef<HTMLDivElement>(null);
 const photo=photos[active];
 function select(index:number){
  const next=(index+photos.length)%photos.length;
  setActive(next);
  thumbs.current?.querySelectorAll('button')[next]?.scrollIntoView({block:'nearest',inline:'nearest'});
 }
 return <div className="real-product-gallery" id="sample-photographs">
  <button type="button" className="real-gallery-main" onClick={()=>dialog.current?.showModal()} aria-label={`Enlarge ${code} sample photograph: ${photo.label}`}><img src={photo.src} alt={photo.alt} width="2000" height="2000"/></button>
  {photos.length>1&&<div ref={thumbs} className="real-gallery-thumbs" aria-label={`${code} sample photographs`} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(active+(e.key==='ArrowRight'?1:-1)+photos.length)%photos.length;select(next);thumbs.current?.querySelectorAll('button')[next]?.focus();}}}>
   {photos.map((p,i)=><button key={p.src} type="button" aria-pressed={active===i} aria-label={p.label} onClick={()=>setActive(i)}><img src={p.thumb||p.src} alt="" loading="lazy"/></button>)}
  </div>}
  <p className="gallery-selection-label" aria-live="polite">{active+1} / {photos.length} · {photo.label}</p>
  <dialog ref={dialog} className="photo-dialog" aria-label={`${code} sample photograph viewer`} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(e.key==='ArrowRight'?1+active:active-1);}}} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
   <button type="button" className="photo-close" onClick={()=>dialog.current?.close()} aria-label="Close photograph">Close ×</button>
   <img src={photo.src} alt={photo.alt}/>
   <div className="gallery-viewer-controls"><button type="button" onClick={()=>select(active-1)}>Previous</button><span>{active+1} / {photos.length}</span><button type="button" onClick={()=>select(active+1)}>Next</button></div>
   <p>{photo.label}</p>
  </dialog>
 </div>;
}
