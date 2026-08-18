/**
 * "SHARE MY ROSIX GIRL".
 *
 * Native Web Share where it exists (which is most phones, and this quiz is
 * built for Instagram traffic); clipboard copy everywhere else. Either way the
 * link is result-specific, so it reopens on exactly this result.
 */

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import type { RosixResult } from '../data/results';
import { buildResultUrl, buildShareText } from '../lib/share';
import { track } from '../lib/analytics';

interface ShareButtonProps {
  result: RosixResult;
}

type ShareState = 'idle' | 'copied' | 'failed';

export function ShareButton({ result }: ShareButtonProps) {
  const [state, setState] = useState<ShareState>('idle');
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (next: ShareState) => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2600);
  };

  const onShare = async () => {
    const url = buildResultUrl(result.slug);
    const title = `${result.title} — ${siteConfig.siteName}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: buildShareText(result), url });
        track('result_shared', { result: result.key, method: 'web-share' });
        return;
      } catch {
        // Cancelled or unavailable — fall through to the clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      track('result_shared', { result: result.key, method: 'clipboard' });
      flash('copied');
    } catch {
      flash('failed');
    }
  };

  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={onShare}>
        {siteConfig.result.shareLabel}
      </button>

      {state !== 'idle' ? (
        <p className="toast" role="status">
          {state === 'copied' ? 'Link copied — go tell your group chat' : 'Copy failed — long-press the address bar'}
        </p>
      ) : null}
    </>
  );
}
