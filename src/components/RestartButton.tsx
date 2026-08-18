/**
 * Restart / "find your own". The same control with two labels: someone who
 * landed on a shared link is invited to take the quiz, not to "retake" it.
 */

import { siteConfig } from '../data/siteConfig';

interface RestartButtonProps {
  onRestart: () => void;
  /** True when the visitor arrived via a shared result link. */
  shared?: boolean;
}

export function RestartButton({ onRestart, shared = false }: RestartButtonProps) {
  return (
    <button
      type="button"
      className={shared ? 'btn btn--block' : 'btn btn--ghost'}
      onClick={onRestart}
    >
      {shared ? siteConfig.result.findYourOwnLabel : siteConfig.result.restartLabel}
    </button>
  );
}
