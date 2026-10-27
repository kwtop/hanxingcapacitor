import { useEffect, useRef, useState } from 'react';
import type { ReferenceGalleryPhoto } from '../data/productReference';
import ImageWithFeedback from './ImageWithFeedback';
import PhotoViewer from './PhotoViewer';
import { findPolishedMedia } from '../data/imagePolish';

export default function ProductReferenceGallery({ photos: originals, code, display }: { photos: ReferenceGalleryPhoto[]; code: string; display?: {src: string; alt: string} }) {
  const photos: ReferenceGalleryPhoto[] = display ? [{...display, thumb:findPolishedMedia(display.src)?.thumb, label: `${code} product view`}, ...originals] : originals;
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastTracked = useRef(active);
  const photo = photos[active];

  function step(delta: number) { setActive(i => (i + delta + photos.length) % photos.length); }

  useEffect(() => {
    if(lastTracked.current!==active){if(!viewing)window.dispatchEvent(new CustomEvent('hx:track',{detail:{type:'image_view',options:{product:code,position:'product_gallery'}}}));lastTracked.current=active;}
    const track = rail.current;
    const thumb = track?.children[active] as HTMLElement | undefined;
    if (track && thumb) {
      if (thumb.offsetLeft < track.scrollLeft) track.scrollLeft = thumb.offsetLeft;
      else if (thumb.offsetLeft + thumb.offsetWidth > track.scrollLeft + track.clientWidth) track.scrollLeft = thumb.offsetLeft + thumb.offsetWidth - track.clientWidth;
    }
  }, [active,code,viewing]);

  if (!photo) return null;
  const viewerPhotos = photos.map((item, index) => ({
    ...item, src: item.originalSrc || item.src, series: code,
    note: display && index === 0 ? 'Illustrative studio view. Check the original sample photographs and model documents for specification approval.' : 'Original supplied sample photograph. The photographed part is a reference, not a confirmed order configuration.',
    inquiryHref: `/contact/?series=${code}${display && index === 0 ? '' : '&photo=' + encodeURIComponent(item.id || `${code}-photo-${index + 1 - (display ? 1 : 0)}`)}`,
  }));
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; },
    onTouchEnd: (e: React.TouchEvent) => {
      const start = touchStart.current; touchStart.current = null;
      if (!start || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - start.x, dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    },
  };

  return <div className={'pdr-gallery pg-gallery' + (display ? ' ss-product-gallery' : '')} id="sample-photographs" data-photo-kind={display && active === 0 ? 'display' : 'sample'}>
    <div className="pg-stage" {...swipe}>
      <button type="button" className="pdr-main-photo pg-main" onClick={() => setViewing(true)} aria-label={`Enlarge ${photo.label}`}><ImageWithFeedback key={photo.src} src={photo.src} alt={photo.alt} width={2000} height={2000} sizes="(max-width: 800px) calc(100vw - 48px), (max-width: 1420px) 50vw, 686px" retryable={false} /></button>
      <button className="pg-step pg-previous" type="button" onClick={() => step(-1)} aria-label={display ? 'Previous product view' : 'Previous sample photograph'}><span aria-hidden="true">←</span></button>
      <button className="pg-step pg-next" type="button" onClick={() => step(1)} aria-label={display ? 'Next product view' : 'Next sample photograph'}><span aria-hidden="true">→</span></button>
    </div>
    <div ref={rail} className="pg-filmstrip" role="group" aria-label={`${code} sample photographs`} onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? photos.length - 1 : (active + (event.key === 'ArrowRight' ? 1 : -1) + photos.length) % photos.length;
        setActive(next); (rail.current?.children[next] as HTMLElement | undefined)?.focus();
      }
    }}>{photos.map((p, index) => <button key={p.src} type="button" aria-label={`Select photograph ${index + 1}: ${p.label}`} aria-pressed={active === index} onClick={() => setActive(index)}><img src={p.thumb || p.src} alt="" width="120" height="120" loading="lazy" /></button>)}</div>
    <div className="pg-caption-row"><div className="pg-caption" aria-live="polite"><strong>{photo.label}</strong><span>{active + 1} / {photos.length}</span></div></div>
    <PhotoViewer photos={viewerPhotos} active={viewing ? active : null} onSelect={setActive} onClose={() => setViewing(false)} />
  </div>;
}
