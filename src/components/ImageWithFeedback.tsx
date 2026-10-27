import { useEffect, useRef, useState } from 'react';
import { findPolishedMedia } from '../data/imagePolish';

type Props = {
  src: string; alt: string; width?: number; height?: number; sizes?: string;
  loading?: 'lazy' | 'eager'; retryable?: boolean;
  previewState?: 'loading' | 'error';
  errorActionLabel?: string;
};

export default function ImageWithFeedback({ src, alt, width = 1200, height = 1200, sizes = '100vw', loading = 'eager', retryable = true, previewState, errorActionLabel = 'Open the viewer to retry.' }: Props) {
  const asset = findPolishedMedia(src);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(previewState);
  const img = useRef<HTMLImageElement>(null);
  const state = preview || status;
  const source = attempt ? `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}` : src;

  useEffect(() => {
    const image = img.current;
    if (image?.complete && image.naturalWidth > 0) setStatus('ready');
    const timer = window.setTimeout(() => setSlow(true), 400);
    return () => window.clearTimeout(timer);
  }, [source]);

  const retry = () => { img.current?.parentElement?.focus({ preventScroll: true }); setPreview(undefined); setStatus('loading'); setSlow(false); setAttempt(n => n + 1); };
  return <span className="media-feedback" tabIndex={retryable ? -1 : undefined} data-media-state={state} data-preview={preview} aria-busy={state === 'loading'}>
    <img ref={img} key={source} src={source} srcSet={attempt ? undefined : asset?.srcset} sizes={asset && !attempt ? sizes : undefined} alt={alt} width={asset?.width ?? width} height={asset?.height ?? height} loading={loading} decoding="async" onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
    {(state === 'error' || (state === 'loading' && (slow || preview))) && <span className="media-feedback-message" role="status">
      <span>{state === 'error' ? 'Photograph could not load.' : 'Loading photograph…'}</span>
      {retryable ? <button className="media-retry" type="button" onClick={retry}>{preview === 'loading' ? 'Load photograph' : 'Retry photograph'}</button> : state === 'error' && <span>{errorActionLabel}</span>}
    </span>}
  </span>;
}
