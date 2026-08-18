/**
 * One question, five options, big touch targets.
 *
 * Double-submit protection: the parent passes `locked` while the screen is
 * transitioning, which disables every option. One tap, one answer.
 */

import { useEffect, useRef } from 'react';
import type { QuizQuestion } from '../data/questions';

interface QuestionCardProps {
  question: QuizQuestion;
  /** Option id already chosen for this question, restored when going Back. */
  chosenOptionId?: string;
  locked: boolean;
  onAnswer: (optionId: string) => void;
}

export function QuestionCard({
  question,
  chosenOptionId,
  locked,
  onAnswer,
}: QuestionCardProps) {
  const heading = useRef<HTMLHeadingElement>(null);

  // Only one question is on screen at a time, so when it changes we move focus
  // to the new heading. Without this, keyboard and screen-reader users are
  // dropped back to the top of the document on every answer, and the tab order
  // silently shifts under them. preventScroll keeps the smooth scroll ours.
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [question.id]);

  return (
    <div key={question.id} className="anim-enter">
      <h2
        className="display question__prompt"
        id={`${question.id}-prompt`}
        ref={heading}
        tabIndex={-1}
      >
        {question.prompt}
      </h2>

      <ul className="options anim-stagger" aria-labelledby={`${question.id}-prompt`}>
        {question.options.map((option) => {
          const chosen = option.id === chosenOptionId;
          return (
            <li key={option.id}>
              <button
                type="button"
                className={`option${chosen ? ' option--chosen' : ''}`}
                onClick={() => onAnswer(option.id)}
                disabled={locked}
                aria-pressed={chosen}
              >
                <span className="option__key" aria-hidden="true">
                  {option.id}
                </span>
                <span>{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
