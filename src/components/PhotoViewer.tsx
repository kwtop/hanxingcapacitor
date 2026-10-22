import { useEffect, useId, useRef } from 'react';
import ImageWithFeedback from './ImageWithFeedback';

export type ViewerPhoto = { src: string; alt?: string; label: string; id?: string; series?: string; note?: string; inquiryHref?: string };

export default function PhotoViewer({ photos, active, onSelect, onClose, previewState }: {
  photos: ViewerPhoto[]; active: number | null; onSelect: (index: number) => void; onClose: () => void;
  previewState?: 'loading' | 'error';
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const outside = useRef(false);
  const heading = useId();
  const open = active !== null && !!photos[active];
  const photo = open ? photos[active!] : null;
  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const focused = document.activeElement as HTMLElement | null;
    const trigger = focused?.closest<HTMLElement>('button, a[href]') || focused;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  const step = (delta: number) => onSelect((active! + delta + photos.length) % photos.length);
  return <dialog ref={dialog} className="interactive-photo-viewer" aria-labelledby={heading} onCancel={event => { event.preventDefault(); onClose(); }}
    onPointerDown={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      outside.current = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    }} onClick={event => { if (event.target === event.currentTarget && outside.current) onClose(); }}
    onKeyDown={event => {
      if (!open) return;
      if (event.key === 'Tab') {
        const targets = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')].filter(target => target.getClientRects().length > 0);
        const first = targets[0], last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        else if (!targets.includes(document.activeElement as HTMLElement)) { event.preventDefault(); first?.focus(); }
        return;
      }
      if (photos.length < 2) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); onSelect(event.key === 'Home' ? 0 : photos.length - 1); }
    }}>
    {photo && <div className="photo-viewer-content">
      <div className="photo-viewer-header"><h2 id={heading}>{photo.id || photo.series || 'Photograph'}</h2><button type="button" className="viewer-close" onClick={onClose} autoFocus>Close <span aria-hidden="true">×</span></button></div>
      <div className="photo-viewer-image"><ImageWithFeedback key={photo.src} src={photo.src} alt={photo.alt || photo.label} previewState={active === 0 ? previewState : undefined} /></div>
      <div className="photo-viewer-controls">{photos.length > 1 && <button type="button" onClick={() => step(-1)} aria-label="Previous photograph">← Previous</button>}<span role="status" aria-live="polite">{active! + 1} / {photos.length}</span>{photos.length > 1 && <button type="button" onClick={() => step(1)} aria-label="Next photograph">Next →</button>}</div>
      <div className="photo-viewer-caption"><p>{photo.label}</p>{photo.note && <p className="photo-viewer-note">{photo.note}</p>}{photo.inquiryHref && <a className="button" href={photo.inquiryHref}>Ask about this sample</a>}</div>
    </div>}
  </dialog>;
}
