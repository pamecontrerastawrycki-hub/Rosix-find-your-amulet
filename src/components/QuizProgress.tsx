/**
 * "01 / 05" plus a segmented Y2K progress track.
 * The score is never shown — only how far along the visitor is.
 */

interface QuizProgressProps {
  current: number; // 1-based
  total: number;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="progress">
      <span className="progress__count" aria-hidden="true">
        {pad(current)} / {pad(total)}
      </span>
      <span className="sr-only">
        Question {current} of {total}
      </span>
      <span
        className="progress__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Quiz progress"
      >
        {Array.from({ length: total }, (_, index) => {
          const step = index + 1;
          const state =
            step < current ? ' progress__seg--done' : step === current ? ' progress__seg--current' : '';
          return <span key={step} className={`progress__seg${state}`} />;
        })}
      </span>
    </div>
  );
}
