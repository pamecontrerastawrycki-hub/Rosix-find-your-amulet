/**
 * ROSIX — scoring tests.
 *
 * Proves the things the brief asks to be verified before shipping:
 *   • every one of the seven results is reachable
 *   • the data itself is well-formed (five options, valid keys, real slugs)
 *   • all three tie-break stages behave, deterministically
 */

import { describe, expect, it } from 'vitest';

import { PRIMARY_WEIGHT, questions, totalQuestions } from '../data/questions';
import { getResultBySlug, resultOrder, results, type ResultKey } from '../data/results';
import { scoreQuiz, TIE_BREAK_ORDER, type Answer } from './scoring';

const OPTION_IDS = ['A', 'B', 'C', 'D', 'E'];

/** Build an answer set from option letters, e.g. answersFrom('AABBC'). */
function answersFrom(letters: string): Answer[] {
  return [...letters].map((optionId, index) => ({
    questionId: questions[index]!.id,
    optionId,
  }));
}

/** Every possible run of the quiz: 5 questions × 5 options = 3125 combinations. */
function everyCombination(): string[] {
  let combos = [''];
  for (let i = 0; i < totalQuestions; i += 1) {
    combos = combos.flatMap((prefix) => OPTION_IDS.map((id) => prefix + id));
  }
  return combos;
}

describe('quiz data', () => {
  it('has five questions with exactly five options each', () => {
    expect(questions).toHaveLength(5);
    for (const question of questions) {
      expect(question.options).toHaveLength(5);
      expect(question.options.map((o) => o.id)).toEqual(OPTION_IDS);
    }
  });

  it('only ever scores real result keys, with positive weights', () => {
    const valid = new Set<string>(resultOrder);
    for (const question of questions) {
      for (const option of question.options) {
        const entries = Object.entries(option.scores);
        expect(entries.length).toBeGreaterThan(0);
        for (const [key, points] of entries) {
          expect(valid.has(key)).toBe(true);
          expect(points).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives every question exactly one +2 primary per option', () => {
    for (const question of questions) {
      for (const option of question.options) {
        const primaries = Object.values(option.scores).filter((p) => p >= PRIMARY_WEIGHT);
        expect(primaries).toHaveLength(1);
      }
    }
  });

  it('defines seven results with unique slugs and live Shopify links', () => {
    expect(resultOrder).toHaveLength(7);
    const slugs = new Set<string>();
    for (const key of resultOrder) {
      const result = results[key];
      expect(result.key).toBe(key);
      expect(slugs.has(result.slug)).toBe(false);
      slugs.add(result.slug);

      expect(result.oracle).toHaveLength(3);
      expect(result.concepts).toHaveLength(3);
      expect(result.image).toMatch(/^\/assets\/characters\/\d{2}-.+\.png$/);
      expect(result.shopifyUrl).toMatch(/^https:\/\/rosixamuletos\.com\/products\/[a-z0-9-]+$/);
      expect(getResultBySlug(result.slug)?.key).toBe(key);
    }
  });
});

describe('scoreQuiz', () => {
  it('never reveals a winner that is not a real result', () => {
    for (const combo of everyCombination()) {
      expect(resultOrder).toContain(scoreQuiz(answersFrom(combo)).winner);
    }
  });

  it('makes all seven results reachable', () => {
    const reached = new Map<ResultKey, string>();
    for (const combo of everyCombination()) {
      const { winner } = scoreQuiz(answersFrom(combo));
      if (!reached.has(winner)) reached.set(winner, combo);
    }

    for (const key of resultOrder) {
      expect(reached.get(key), `no answer path reaches ${key}`).toBeDefined();
    }
    expect(reached.size).toBe(7);
  });

  it('is deterministic — the same answers always give the same result', () => {
    for (const combo of ['ABCDE', 'EDCBA', 'CCCCC', 'ADBEC']) {
      const first = scoreQuiz(answersFrom(combo)).winner;
      for (let i = 0; i < 5; i += 1) {
        expect(scoreQuiz(answersFrom(combo)).winner).toBe(first);
      }
    }
  });

  it('adds weights exactly as declared in questions.ts', () => {
    // q1A: newEra +2, plotTwist +1 · q2A: plotTwist +2, newEra +1
    const { totals, primaries } = scoreQuiz(answersFrom('AA'));
    expect(totals.newEra).toBe(3);
    expect(totals.plotTwist).toBe(3);
    expect(primaries.newEra).toBe(1);
    expect(primaries.plotTwist).toBe(1);
  });

  it('ignores unknown questions and options instead of throwing', () => {
    const outcome = scoreQuiz([
      { questionId: 'q1', optionId: 'A' },
      { questionId: 'does-not-exist', optionId: 'A' },
      { questionId: 'q2', optionId: 'Z' },
    ]);
    expect(outcome.totals.newEra).toBe(2);
    expect(resultOrder).toContain(outcome.winner);
  });

  it('reports an outright win as decidedBy "none"', () => {
    // Four main-character primaries: nothing can catch it.
    const outcome = scoreQuiz(answersFrom('CBAAA'));
    expect(outcome.winner).toBe('mainCharacter');
    expect(outcome.decidedBy).toBe('none');
    expect(outcome.tied).toEqual(['mainCharacter']);
  });
});

describe('tie-breaking', () => {
  it('stage 1 — more +2 primaries wins, even against a more recent answer', () => {
    const outcome = scoreQuiz([
      { questionId: 'q2', optionId: 'C' }, // gutFeeling +2, doNotDisturb +1
      { questionId: 'q3', optionId: 'C' }, // gutFeeling +2, doNotDisturb +1
      { questionId: 'q4', optionId: 'C' }, // doNotDisturb +2, noContact  +1
    ]);

    // Level on points, but gutFeeling got there on two primaries against one.
    expect(outcome.totals.gutFeeling).toBe(4);
    expect(outcome.totals.doNotDisturb).toBe(4);
    expect(outcome.primaries.gutFeeling).toBe(2);
    expect(outcome.primaries.doNotDisturb).toBe(1);

    // The most recent answer favoured doNotDisturb — stage 1 still wins.
    expect(outcome.decidedBy).toBe('primaries');
    expect(outcome.winner).toBe('gutFeeling');
  });

  it('falls through to stage 2 when primary counts are level', () => {
    const outcome = scoreQuiz([
      { questionId: 'q1', optionId: 'A' }, // newEra +2, plotTwist +1
      { questionId: 'q3', optionId: 'E' }, // newEra +2, plotTwist +1
      { questionId: 'q2', optionId: 'A' }, // plotTwist +2, newEra +1
      { questionId: 'q4', optionId: 'E' }, // plotTwist +2, newEra +1
    ]);
    // newEra 6 / plotTwist 6, primaries 2 each → stage 1 cannot split them.
    expect(outcome.totals.newEra).toBe(outcome.totals.plotTwist);
    expect(outcome.primaries.newEra).toBe(outcome.primaries.plotTwist);
    expect(outcome.decidedBy).toBe('recency');
    // The most recent answer (q4E) scored plotTwist +2 against newEra +1.
    expect(outcome.winner).toBe('plotTwist');
  });

  it('stage 2 — the most recent deciding answer wins, and order matters', () => {
    const forward = scoreQuiz([
      { questionId: 'q1', optionId: 'A' },
      { questionId: 'q2', optionId: 'A' },
    ]);
    const reversed = scoreQuiz([
      { questionId: 'q2', optionId: 'A' },
      { questionId: 'q1', optionId: 'A' },
    ]);

    expect(forward.decidedBy).toBe('recency');
    expect(reversed.decidedBy).toBe('recency');
    // Same two answers, different order → the later one decides.
    expect(forward.winner).toBe('plotTwist');
    expect(reversed.winner).toBe('newEra');
  });

  it('stage 3 — falls back to the configured order, never to randomness', () => {
    // No answers at all: everything is level at zero and nothing can decide.
    const outcome = scoreQuiz([]);
    expect(outcome.tied).toHaveLength(7);
    expect(outcome.decidedBy).toBe('configuredOrder');
    expect(outcome.winner).toBe(TIE_BREAK_ORDER[0]);

    for (let i = 0; i < 20; i += 1) {
      expect(scoreQuiz([]).winner).toBe(TIE_BREAK_ORDER[0]);
    }
  });

  it('keeps the configured fallback order covering all seven results', () => {
    expect([...TIE_BREAK_ORDER].sort()).toEqual([...resultOrder].sort());
  });
});
