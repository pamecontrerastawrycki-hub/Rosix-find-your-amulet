/**
 * The reveal sequence between the last answer and the result.
 *
 * Four lines of oracle copy, a Y2K loading bar and a little file metadata —
 * about 2.2 seconds, or a fast 0.7s for anyone who prefers reduced motion.
 * No video, no image, nothing that delays the result beyond the sequence.
 */

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Sparkle } from './Sparkle';

interface LoadingRevealProps {
  onDone: () => void;
}

const TICK_MS = 60;

export function LoadingReveal({ onDone }: LoadingRevealProps) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const { lines } = siteConfig.loading;
  const duration = reducedMotion
    ? siteConfig.loading.reducedDurationMs
    : siteConfig.loading.durationMs;

  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => {
      const ratio = Math.min(1, (performance.now() - started) / duration);
      setProgress(ratio);
      if (ratio >= 1) {
        window.clearInterval(timer);
        doneRef.current();
      }
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [duration]);

  // Step through the four lines across the full duration.
  const index = Math.min(lines.length - 1, Math.floor(progress * lines.length));
  const line = lines[index] ?? lines[0] ?? '';

  return (
    <div className="loading">
      <div className="loading__stars" aria-hidden="true">
        <Sparkle size={30} className="sparkle sparkle--turn" style={{ top: 0, left: '34%' }} />
        <Sparkle size={18} className="sparkle" style={{ top: '46%', left: 0 }} />
        <Sparkle
          size={22}
          className="sparkle sparkle--slow"
          style={{ bottom: '4%', right: '6%' }}
          color="var(--rosix-pink)"
        />
      </div>

      {/* One polite live region: a screen reader hears each stage once. */}
      <p className="loading__line" role="status" aria-live="polite">
        {line}
      </p>

      <div className="loading__bar">
        <div
          className="loading__fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="loading__meta">
        <span className="meta">FILE: RW-GIRL-QUIZ</span>
        <span className="meta">{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
        <span className="meta">ROSIX DIGITAL ORACLE</span>
      </div>
    </div>
  );
}
