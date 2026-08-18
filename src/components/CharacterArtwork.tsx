/**
 * The character illustrations — the heart of the whole experience.
 *
 * Rules this component exists to guarantee:
 *   • object-fit: contain, always. Heads, shoes, bags and bracelets stay whole.
 *   • a square box reserved up front, so nothing shifts while loading.
 *   • responsive WebP when derivatives exist, original PNG otherwise.
 *   • a clearly LABELLED placeholder when a file is missing — never a broken
 *     image icon, never a silent gap, and never a substitute illustration.
 */

import { useState } from 'react';
import { getArtworkSources } from '../lib/images';
import { Sparkle } from './Sparkle';

interface CharacterArtworkProps {
  /** Path under /public, e.g. "/assets/characters/01-plot-twist-girl.png". */
  src: string;
  alt: string;
  /** Human-readable name used by the missing-file placeholder. */
  label: string;
  /** Only the cover image should be eager. Results stay lazy. */
  priority?: boolean;
  /** Gentle floating motion. */
  float?: boolean;
  /** Occasional digital-camera flash. */
  flash?: boolean;
  /** Sizes hint for the responsive srcset. */
  sizes?: string;
  className?: string;
}

export function CharacterArtwork({
  src,
  alt,
  label,
  priority = false,
  float = false,
  flash = false,
  sizes = '(min-width: 46rem) 26rem, 92vw',
  className = '',
}: CharacterArtworkProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const { png, webpSrcSet } = getArtworkSources(src);

  const classes = [
    'art',
    float ? 'art--float' : '',
    flash ? 'art--flash' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (status === 'missing') {
    return (
      <div className={classes}>
        {/* Replace the file at this exact path and the placeholder disappears. */}
        <div className="art__placeholder" role="img" aria-label={`Artwork coming soon: ${label}`}>
          <Sparkle size={26} className="art__placeholder-icon sparkle--slow" />
          <span className="art__placeholder-label">Artwork coming soon</span>
          <span className="art__placeholder-label">{label}</span>
          <span className="art__placeholder-path">{src}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <picture>
        {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
        <img
          className={`art__img${status === 'loading' ? ' art__img--loading' : ''}`}
          src={png}
          alt={alt}
          width={1024}
          height={1024}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('missing')}
        />
      </picture>
      <span className="art__flash" aria-hidden="true" />
    </div>
  );
}
