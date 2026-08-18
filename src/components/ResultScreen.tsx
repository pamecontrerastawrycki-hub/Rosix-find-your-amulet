/**
 * One layout system, seven results. Everything on this screen comes from
 * src/data/results.ts — there is no per-result branching in here at all.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import type { RosixResult } from '../data/results';
import { track } from '../lib/analytics';
import { CharacterArtwork } from './CharacterArtwork';
import { CustomModal } from './CustomModal';
import { RestartButton } from './RestartButton';
import { ShareButton } from './ShareButton';
import { ShopifyCTA } from './ShopifyCTA';
import { Sparkle } from './Sparkle';

interface ResultScreenProps {
  result: RosixResult;
  /** True when the visitor arrived on a shared link instead of taking the quiz. */
  shared?: boolean;
  onRestart: () => void;
}

/** Resolve the configured custom destination, expanding the {result} token. */
function resolveCustomUrl(resultKey: string): string {
  const template = siteConfig.custom.customUrl;
  if (!template) return `/customize?result=${resultKey}`;
  return template.replace('{result}', resultKey);
}

export function ResultScreen({ result, shared = false, onRestart }: ResultScreenProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    track('result_viewed', { result: result.key, chapter: result.chapter, shared });
  }, [result.key, result.chapter, shared]);

  const onMakeItYours = () => {
    track('make_it_yours_clicked', {
      result: result.key,
      customAvailable: siteConfig.custom.customAvailable,
    });

    // The single switch: flip `customAvailable` in siteConfig and this button
    // starts navigating instead of explaining. No component changes needed.
    if (!siteConfig.custom.customAvailable) {
      setModalOpen(true);
      return;
    }

    const destination = resolveCustomUrl(result.key);
    if (/^https?:\/\//.test(destination)) {
      window.open(destination, '_blank', 'noopener,noreferrer');
    } else {
      navigate(destination);
    }
  };

  const onNotify = () => {
    const target = siteConfig.custom.modal.notifyUrl || siteConfig.instagramUrl;
    window.open(target, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  return (
    <section
      className="anim-enter"
      aria-labelledby="result-title"
      style={
        {
          '--accent-tint': result.accent.tint,
          '--accent': result.accent.accent,
          '--accent-stone': result.accent.stone,
        } as React.CSSProperties
      }
    >
      <div className="result__layout">
        <div className="result__art">
          <Sparkle
            size={20}
            className="sparkle sparkle--turn"
            style={{ top: '5%', right: '7%' }}
            color="var(--accent-stone)"
          />
          <Sparkle
            size={14}
            className="sparkle sparkle--slow"
            style={{ bottom: '10%', left: '6%' }}
          />
          <CharacterArtwork
            src={result.image}
            alt={result.imageAlt}
            label={result.title}
            float
            sizes="(min-width: 46rem) 26rem, 90vw"
          />
        </div>

        <div>
          <p className="eyebrow result__eyebrow">{siteConfig.result.eyebrow}</p>

          <h1 className="display result__title" id="result-title">
            {result.title}
          </h1>

          <blockquote className="result__oracle">
            {result.oracle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </blockquote>

          <div className="result__facts">
            <div className="fact">
              <span className="fact__label">Your chapter</span>
              <span className="fact__value">{result.chapter}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Your stone</span>
              <span className="fact__value">{result.stone}</span>
            </div>
          </div>

          <ul className="result__concepts" aria-label="Your energy">
            {result.concepts.map((concept) => (
              <li key={concept} className="chip">
                {concept}
              </li>
            ))}
          </ul>

          <p className="display result__closing">
            <span className="result__closing-inner">{siteConfig.result.closingPhrase}</span>
          </p>

          <div className="result__ctas">
            <ShopifyCTA result={result} />

            <button type="button" className="btn btn--block" onClick={onMakeItYours}>
              {siteConfig.result.secondaryCtaLabel}
            </button>
          </div>

          <div className="result__secondary-actions">
            <ShareButton result={result} />
            <RestartButton onRestart={onRestart} shared={shared} />
          </div>
        </div>
      </div>

      <CustomModal open={modalOpen} onClose={() => setModalOpen(false)} onNotify={onNotify} />
    </section>
  );
}
