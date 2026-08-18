/**
 * The quiz itself: intro → five questions → reveal → result.
 *
 * All state lives here so answers survive going Back and forth. Nothing is
 * persisted to storage — no account, no cookie, no personal data.
 */

import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, totalQuestions } from '../data/questions';
import { results } from '../data/results';
import { siteConfig } from '../data/siteConfig';
import { scoreQuiz, type Answer } from '../lib/scoring';
import { track } from '../lib/analytics';
import { IntroScreen } from '../components/IntroScreen';
import { LoadingReveal } from '../components/LoadingReveal';
import { QuestionCard } from '../components/QuestionCard';
import { QuizProgress } from '../components/QuizProgress';
import { ResultScreen } from '../components/ResultScreen';
import { WindowFrame } from '../components/WindowFrame';
import { resultPath } from '../lib/share';

type Stage = 'intro' | 'quiz' | 'loading' | 'result';

const WINDOW_TITLES: Record<Stage, string> = {
  intro: 'ROSIX DIGITAL ORACLE',
  quiz: 'RW-GIRL-QUIZ',
  loading: 'READING…',
  result: 'YOUR RESULT',
};

export function QuizPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  /** Locks the options for one beat so a fast double-tap cannot answer twice. */
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();

  const question = questions[index];

  /** Only computed once every question is answered. */
  const outcome = useMemo(
    () => (answers.length === totalQuestions ? scoreQuiz(answers) : null),
    [answers],
  );

  const start = () => {
    track('quiz_started');
    setStage('quiz');
  };

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setLocked(false);
    setStage('intro');
    window.scrollTo({ top: 0 });
  }, []);

  const answer = (optionId: string) => {
    if (locked || !question) return;
    setLocked(true);

    // Replace any previous answer for this question, keeping answer order
    // meaningful for the recency tie-break.
    const next: Answer[] = [
      ...answers.filter((item) => item.questionId !== question.id),
      { questionId: question.id, optionId },
    ];
    setAnswers(next);

    track('question_answered', {
      question: question.id,
      option: optionId,
      position: index + 1,
    });

    // A short beat so the tap registers visually before the screen changes.
    window.setTimeout(() => {
      if (index + 1 < totalQuestions) {
        setIndex(index + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        track('quiz_completed', { answered: next.length });
        setStage('loading');
      }
      setLocked(false);
    }, 180);
  };

  const back = () => {
    if (index === 0) {
      setStage('intro');
      return;
    }
    setIndex(index - 1);
  };

  const onRevealDone = useCallback(() => setStage('result'), []);

  const chosenForCurrent = question
    ? answers.find((item) => item.questionId === question.id)?.optionId
    : undefined;

  return (
    <WindowFrame title={WINDOW_TITLES[stage]} wide={stage === 'result'}>
      {stage === 'intro' ? <IntroScreen onStart={start} /> : null}

      {stage === 'quiz' && question ? (
        <section aria-label="Quiz">
          <div className="quiz__top">
            <button type="button" className="quiz__back" onClick={back}>
              <span aria-hidden="true">←</span> Back
            </button>
            <QuizProgress current={index + 1} total={totalQuestions} />
          </div>

          {index === 0 ? (
            <p className="quiz__instruction">{siteConfig.quizInstruction}</p>
          ) : null}

          <QuestionCard
            question={question}
            chosenOptionId={chosenForCurrent}
            locked={locked}
            onAnswer={answer}
          />
        </section>
      ) : null}

      {stage === 'loading' ? <LoadingReveal onDone={onRevealDone} /> : null}

      {stage === 'result' && outcome ? (
        <>
          <ResultScreen result={results[outcome.winner]} onRestart={restart} />
          <p className="page-footer">
            {/* Keeps the shareable URL discoverable without navigating away mid-reveal. */}
            <button
              type="button"
              className="meta"
              style={{ background: 'none', border: 0, cursor: 'pointer' }}
              onClick={() => navigate(resultPath(results[outcome.winner].slug))}
            >
              Open my permanent result link →
            </button>
          </p>
        </>
      ) : null}
    </WindowFrame>
  );
}
