/**
 * Shareable result route: /result/plot-twist, /result/do-not-disturb, …
 *
 * Shows the exact same result without making the visitor take the quiz, while
 * always offering them the chance to find their own.
 */

import { useNavigate, useParams } from 'react-router-dom';
import { getResultBySlug, resultList } from '../data/results';
import { ResultScreen } from '../components/ResultScreen';
import { WindowFrame } from '../components/WindowFrame';

export function ResultPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const result = getResultBySlug(slug);

  if (!result) {
    return (
      <WindowFrame title="NOT FOUND">
        <div className="notfound">
          <h1 className="display" style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
            THAT CHAPTER ISN’T HERE.
          </h1>
          <p style={{ marginBottom: '1.25rem' }}>
            This link doesn’t match one of the seven Rosix girls.
          </p>
          <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/')}>
            FIND YOUR ROSIX GIRL
          </button>
          <p className="meta" style={{ marginTop: '1rem' }}>
            {resultList.length} results · ROSIX DIGITAL ORACLE
          </p>
        </div>
      </WindowFrame>
    );
  }

  return (
    <WindowFrame title="ROSIX RESULT" wide>
      <ResultScreen result={result} shared onRestart={() => navigate('/')} />
    </WindowFrame>
  );
}
