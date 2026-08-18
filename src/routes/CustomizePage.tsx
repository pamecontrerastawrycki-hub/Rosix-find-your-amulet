/**
 * /customize?result=<result-key> — the FUTURE custom amulet flow.
 *
 * Deliberately a polished explainer, not a configurator. The three steps are
 * described and the future choices are shown as an inert, clearly locked
 * preview. Nothing here is selectable, priced or reservable while
 * `siteConfig.custom.customAvailable` is false — and no fake checkout or
 * invented stone inventory exists anywhere in this app.
 */

import { useNavigate, useSearchParams } from 'react-router-dom';
import { customisationOptions, stonesForResult } from '../data/availableStones';
import { results, type ResultKey } from '../data/results';
import { siteConfig } from '../data/siteConfig';
import { WindowFrame } from '../components/WindowFrame';
import { resultPath } from '../lib/share';

const STEPS = [
  {
    title: 'Choose your exact stone',
    copy: 'Not a stone type — the actual one-of-one stone, photographed in Bali.',
  },
  {
    title: 'Choose your vibe',
    copy: 'Cord, metal details and length, so it sits the way you actually wear things.',
  },
  {
    title: 'Reserve it',
    copy: 'A fixed reservation deposit holds your stone. Pamela confirms the rest personally.',
  },
];

function isResultKey(value: string | null): value is ResultKey {
  return value !== null && Object.prototype.hasOwnProperty.call(results, value);
}

export function CustomizePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const raw = params.get('result');
  const resultKey = isResultKey(raw) ? raw : null;
  const result = resultKey ? results[resultKey] : null;

  // Reads the future inventory file. Empty today, and that is fine.
  const stones = resultKey ? stonesForResult(resultKey) : [];
  const live = siteConfig.custom.customAvailable;

  return (
    <WindowFrame title="RW-CUSTOM · COMING SOON">
      <section className="anim-enter" aria-labelledby="custom-title">
        <p className="eyebrow">MAKE IT YOURS</p>

        <h1 className="display" id="custom-title" style={{ fontSize: 'clamp(1.7rem, 8vw, 2.4rem)', margin: '0.4rem 0 0.9rem' }}>
          YOUR OWN ROSIX AMULET
        </h1>

        {result ? (
          <p style={{ marginTop: 0, marginBottom: '1.25rem' }}>
            Starting from <strong>{result.chapter}</strong> — your stone family is{' '}
            <strong>{result.stone}</strong>.
          </p>
        ) : (
          <p style={{ marginTop: 0, marginBottom: '1.25rem' }}>
            Take the quiz first and your chapter will preselect a stone family.
          </p>
        )}

        <ol className="custom__steps">
          {STEPS.map((step, i) => (
            <li className="custom__step" key={step.title}>
              <span className="custom__step-num" aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <span className="custom__step-title">{step.title}</span>
                <p className="custom__step-copy">{step.copy}</p>
              </span>
            </li>
          ))}
        </ol>

        <div className="custom__preview">
          <p className="eyebrow" style={{ marginTop: 0 }}>
            What you’ll choose
          </p>

          {/* Inert on purpose: rendered as plain text, not inputs, so there is
              nothing to tab into, click or mistake for a working control. */}
          {(Object.keys(customisationOptions) as (keyof typeof customisationOptions)[]).map(
            (group) => (
              <div className="custom__group" key={group}>
                <span className="custom__group-label">{customisationOptions[group].label}</span>
                <ul className="custom__choices">
                  {customisationOptions[group].choices.map((choice) => (
                    <li className="custom__choice" key={choice}>
                      {choice}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}

          <p className="custom__locked">
            <span aria-hidden="true">✦</span>
            {live
              ? `${stones.length} stone${stones.length === 1 ? '' : 's'} available`
              : 'Locked until the right stones arrive'}
          </p>
        </div>

        <div className="result__ctas" style={{ marginTop: '1.5rem' }}>
          {result ? (
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => navigate(resultPath(result.slug))}
            >
              BACK TO MY RESULT
            </button>
          ) : null}

          <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>
            {result ? 'RETAKE THE QUIZ' : 'FIND YOUR ROSIX GIRL'}
          </button>
        </div>

        <p className="meta" style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          NO RESERVATION IS TAKEN ON THIS PAGE
        </p>
      </section>
    </WindowFrame>
  );
}
