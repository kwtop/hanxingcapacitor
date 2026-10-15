import { useEffect, useRef, useState } from 'react';
import type { ReferenceGalleryPhoto } from '../data/productReference';

export default function ProductReferenceGallery({ photos, code }: { photos: ReferenceGalleryPhoto[]; code: string }) {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[active];

  function step(delta: number) { setActive(i => (i + delta + photos.length) % photos.length); }

  useEffect(() => {
    const track = rail.current;
    const thumb = track?.children[active] as HTMLElement | undefined;
    if (track && thumb) {
      if (thumb.offsetLeft < track.scrollLeft) track.scrollLeft = thumb.offsetLeft;
      else if (thumb.offsetLeft + thumb.offsetWidth > track.scrollLeft + track.clientWidth) track.scrollLeft = thumb.offsetLeft + thumb.offsetWidth - track.clientWidth;
    }
  }, [active]);

  if (!photo) return null;
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; },
    onTouchEnd: (e: React.TouchEvent) => {
      const start = touchStart.current; touchStart.current = null;
      if (!start || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - start.x, dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    },
  };

  return <div className="pdr-gallery pg-gallery" id="sample-photographs">
    <div className="pg-stage" {...swipe}>
      <div className="pdr-main-photo pg-main"><img src={photo.src} alt={photo.alt} width="2000" height="2000" fetchPriority="high" /></div>
      <button className="pg-step pg-previous" type="button" onClick={() => step(-1)} aria-label="Previous sample photograph"><span aria-hidden="true">←</span></button>
      <button className="pg-step pg-next" type="button" onClick={() => step(1)} aria-label="Next sample photograph"><span aria-hidden="true">→</span></button>
    </div>
    <div ref={rail} className="pg-filmstrip" role="group" aria-label={`${code} sample photographs`}>{photos.map((p, index) => <button key={p.src} type="button" aria-label={`Select photograph ${index + 1}: ${p.label}`} aria-pressed={active === index} onClick={() => setActive(index)}><img src={p.thumb || p.src} alt="" width="120" height="120" loading="lazy" /></button>)}</div>
    <div className="pg-caption-row"><div className="pg-caption" aria-live="polite"><strong>{photo.label}</strong></div></div>
  </div>;
}
