/**
 * ROSIX — the scoring engine.
 * ---------------------------------------------------------------------------
 * Transparent, deterministic and completely data-driven: every weight comes
 * from src/data/questions.ts, every candidate from src/data/results.ts.
 *
 * TIE-BREAKING, in order:
 *   1. Most `+2` primary selections among the tied results.
 *   2. The most recent answer that scored one of the still-tied results.
 *   3. `TIE_BREAK_ORDER` below — deterministic configuration, never random.
 *
 * The visitor never sees a score. `scoreQuiz` returns the breakdown so it can be
 * tested and logged, but the UI only reads `.winner`.
 */

import { PRIMARY_WEIGHT, questions, type QuizQuestion } from '../data/questions';
import { resultOrder, type ResultKey } from '../data/results';

/**
 * Stage-3 fallback. Earlier in this list wins. It is intentionally stored here
 * as configuration rather than derived, so behaviour never changes by accident.
 */
export const TIE_BREAK_ORDER: ResultKey[] = [...resultOrder];

/** One recorded answer: which question, and which option id ('A'–'E'). */
export interface Answer {
  questionId: string;
  optionId: string;
}

export type ScoreTotals = Record<ResultKey, number>;

export interface QuizOutcome {
  winner: ResultKey;
  totals: ScoreTotals;
  /** How many `+2` picks each result received. */
  primaries: ScoreTotals;
  /** Which tie-break stage decided it. 'none' means an outright winner. */
  decidedBy: 'none' | 'primaries' | 'recency' | 'configuredOrder';
  /** The results that were level on raw points. Length 1 when there was no tie. */
  tied: ResultKey[];
}

function emptyTotals(): ScoreTotals {
  return Object.fromEntries(resultOrder.map((key) => [key, 0])) as ScoreTotals;
}

function findQuestion(questionId: string): QuizQuestion | undefined {
  return questions.find((question) => question.id === questionId);
}

/**
 * Resolve an answer to its option. Unknown questions/options are ignored rather
 * than throwing, so a stale saved answer can never break the reveal.
 */
function resolveAnswer(answer: Answer) {
  const question = findQuestion(answer.questionId);
  return question?.options.find((option) => option.id === answer.optionId);
}

/**
 * Score a full (or partial) set of answers.
 * `answers` must be in the order they were given — stage 2 depends on it.
 */
export function scoreQuiz(answers: Answer[]): QuizOutcome {
  const totals = emptyTotals();
  const primaries = emptyTotals();

  for (const answer of answers) {
    const option = resolveAnswer(answer);
    if (!option) continue;

    for (const [key, points] of Object.entries(option.scores) as [ResultKey, number][]) {
      totals[key] += points;
      if (points >= PRIMARY_WEIGHT) primaries[key] += 1;
    }
  }

  // --- Outright winner on points? ----------------------------------------
  const topScore = Math.max(...resultOrder.map((key) => totals[key]));
  const tied = resultOrder.filter((key) => totals[key] === topScore);

  if (tied.length === 1) {
    return { winner: tied[0]!, totals, primaries, decidedBy: 'none', tied };
  }

  // --- Stage 1: most +2 primary selections -------------------------------
  const topPrimaries = Math.max(...tied.map((key) => primaries[key]));
  const byPrimaries = tied.filter((key) => primaries[key] === topPrimaries);

  if (byPrimaries.length === 1) {
    return { winner: byPrimaries[0]!, totals, primaries, decidedBy: 'primaries', tied };
  }

  // --- Stage 2: most recent answer scoring one of the tied results --------
  const stillTied = new Set(byPrimaries);
  for (let i = answers.length - 1; i >= 0; i -= 1) {
    const option = resolveAnswer(answers[i]!);
    if (!option) continue;

    // Within one answer, the heavier weight wins; that keeps a single answer
    // that touches two tied results from being ambiguous.
    let bestKey: ResultKey | undefined;
    let bestPoints = -Infinity;

    for (const [key, points] of Object.entries(option.scores) as [ResultKey, number][]) {
      if (!stillTied.has(key)) continue;
      if (points > bestPoints) {
        bestPoints = points;
        bestKey = key;
      } else if (points === bestPoints && bestKey) {
        // Two tied results scored equally in the same answer — this answer
        // cannot separate them, so fall through to the next-most-recent one.
        bestKey = undefined;
      }
    }

    if (bestKey) {
      return { winner: bestKey, totals, primaries, decidedBy: 'recency', tied };
    }
  }

  // --- Stage 3: deterministic configured order ---------------------------
  const winner = TIE_BREAK_ORDER.find((key) => stillTied.has(key)) ?? byPrimaries[0]!;
  return { winner, totals, primaries, decidedBy: 'configuredOrder', tied };
}
