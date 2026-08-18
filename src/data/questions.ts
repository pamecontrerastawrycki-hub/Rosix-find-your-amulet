/**
 * ROSIX — the five quiz questions and the complete weighted scoring table.
 * ---------------------------------------------------------------------------
 * This file is the ONLY place scoring weights are declared. Components read the
 * questions and hand the chosen answers to `scoreQuiz()` in src/lib/scoring.ts.
 *
 * To edit the quiz you only ever touch this file:
 *   • change wording  → edit `prompt` / `label`
 *   • change weights  → edit `scores`
 *   • add a question  → append to `questions` (keep exactly five options each)
 *
 * Rules enforced by the test suite (src/lib/scoring.test.ts):
 *   • every question has exactly five options
 *   • every score key is a real ResultKey
 *   • all seven results remain reachable
 */

import type { ResultKey } from './results';

/** Points a single answer contributes, keyed by result. */
export type ScoreMap = Partial<Record<ResultKey, number>>;

export interface QuizOption {
  /** 'A'–'E'. Stable, used for analytics and for restoring answers. */
  id: string;
  label: string;
  scores: ScoreMap;
}

export interface QuizQuestion {
  /** Stable id — analytics and saved answers key off this, not the index. */
  id: string;
  prompt: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'WHAT CHAPTER ARE YOU IN RIGHT NOW?',
    options: [
      { id: 'A', label: 'I’m outgrowing everything.', scores: { newEra: 2, plotTwist: 1 } },
      {
        id: 'B',
        label: 'I know it’s time to leave something behind.',
        scores: { noContact: 2, plotTwist: 1 },
      },
      {
        id: 'C',
        label: 'I’m done making myself smaller.',
        scores: { mainCharacter: 2, newEra: 1 },
      },
      {
        id: 'D',
        label: 'Everything is quiet, and it’s freaking me out.',
        scores: { doNotDisturb: 2, gutFeeling: 1 },
      },
      {
        id: 'E',
        label: 'I’m tired of always being the strong one.',
        scores: { softPower: 2, doNotDisturb: 1 },
      },
    ],
  },
  {
    id: 'q2',
    prompt: 'WHAT DOES YOUR NEXT ERA NEED?',
    options: [
      { id: 'A', label: 'A plot twist.', scores: { plotTwist: 2, newEra: 1 } },
      {
        id: 'B',
        label: 'The confidence to actually go for it.',
        scores: { mainCharacter: 2, plotTwist: 1 },
      },
      {
        id: 'C',
        label: 'Less noise. Better intuition.',
        scores: { gutFeeling: 2, doNotDisturb: 1 },
      },
      {
        id: 'D',
        label: 'The courage to walk away.',
        scores: { noContact: 2, mainCharacter: 1 },
      },
      {
        id: 'E',
        label: 'Softness without losing my power.',
        scores: { softPower: 2, newEra: 1 },
      },
    ],
  },
  {
    id: 'q3',
    prompt: 'WHAT ARE WE LEAVING BEHIND?',
    options: [
      {
        id: 'A',
        label: 'Waiting for permission.',
        scores: { mainCharacter: 2, newEra: 1 },
      },
      {
        id: 'B',
        label: 'A situation I keep romanticizing.',
        scores: { noContact: 2, plotTwist: 1 },
      },
      {
        id: 'C',
        label: 'Overthinking what I already know.',
        scores: { gutFeeling: 2, doNotDisturb: 1 },
      },
      {
        id: 'D',
        label: 'Being strong for absolutely everyone.',
        scores: { softPower: 2, doNotDisturb: 1 },
      },
      {
        id: 'E',
        label: 'The version of me who accepted less.',
        scores: { newEra: 2, plotTwist: 1 },
      },
    ],
  },
  {
    id: 'q4',
    prompt: 'PICK THE ENERGY YOU’RE CALLING BACK.',
    options: [
      {
        id: 'A',
        label: 'Main character energy.',
        scores: { mainCharacter: 2, plotTwist: 1 },
      },
      { id: 'B', label: 'Trusting my own taste.', scores: { gutFeeling: 2, newEra: 1 } },
      { id: 'C', label: 'Unbothered peace.', scores: { doNotDisturb: 2, noContact: 1 } },
      { id: 'D', label: 'Soft but untouchable.', scores: { softPower: 2, noContact: 1 } },
      {
        id: 'E',
        label: 'The courage to start over.',
        scores: { plotTwist: 2, newEra: 1 },
      },
    ],
  },
  {
    id: 'q5',
    prompt: 'WHAT WOULD FEEL LIKE A POWER MOVE RIGHT NOW?',
    options: [
      {
        id: 'A',
        label: 'Saying what I actually want.',
        scores: { mainCharacter: 2, gutFeeling: 1 },
      },
      {
        id: 'B',
        label: 'Leaving without needing closure.',
        scores: { noContact: 2, softPower: 1 },
      },
      {
        id: 'C',
        label: 'Starting before I feel ready.',
        scores: { plotTwist: 2, newEra: 1 },
      },
      {
        id: 'D',
        label: 'Resting without feeling guilty.',
        scores: { softPower: 2, doNotDisturb: 1 },
      },
      {
        id: 'E',
        label: 'Trusting the answer I already have.',
        scores: { gutFeeling: 2, doNotDisturb: 1 },
      },
    ],
  },
];

/** Points that mark an answer as a "primary" pick for a result. Tie-break rule 1. */
export const PRIMARY_WEIGHT = 2;

export const totalQuestions = questions.length;
