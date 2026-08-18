/**
 * ROSIX — future custom-amulet stone inventory. NOT ACTIVE.
 * ---------------------------------------------------------------------------
 * Nothing in the live quiz reads this file yet; it exists so real one-of-one
 * stones can be added later without redesigning anything. The custom flow is
 * gated behind `siteConfig.custom.customAvailable`.
 *
 * Intended future flow:
 *   1. The quiz result preselects a stone category (`matchesResults`).
 *   2. The visitor sees the exact physical stones that are still available.
 *   3. They choose one, then a cord vibe, metal detail and length.
 *   4. They pay a fixed reservation deposit through Shopify (`depositUrl`).
 *   5. Pamela confirms the remaining design details personally.
 *
 * NO payments, carts or Shopify writes are implemented anywhere in this app.
 */

import type { ResultKey } from './results';

export interface AvailableStone {
  /** Human-readable stable id, e.g. "ST-001". Also used in URLs later. */
  id: string;
  name: string;
  /** Path under /public. Photograph of the actual stone — one of one. */
  image: string;
  /** Short energy words, shown as chips. */
  energy: string[];
  /** False once the stone is reserved or sold. */
  available: boolean;
  /** Shopify variant gid for the deposit line item. Empty until it exists. */
  shopifyVariantId: string;
  /** Direct reservation link. Empty falls back to siteConfig.custom.depositUrl. */
  depositUrl: string;
  /** Which quiz results this stone should be offered for. Optional. */
  matchesResults?: ResultKey[];
}

/**
 * EMPTY ON PURPOSE — real stones go here.
 *
 * Example entry (delete the comment, keep the shape):
 *
 *   {
 *     id: 'ST-001',
 *     name: 'Rose Quartz',
 *     image: '/assets/stones/ST-001.webp',
 *     energy: ['Self Love', 'Softness', 'Becoming'],
 *     available: true,
 *     shopifyVariantId: '',
 *     depositUrl: '',
 *     matchesResults: ['newEra'],
 *   },
 */
export const availableStones: AvailableStone[] = [];

/** Stones still on offer for a given result. Safe to call with an empty list. */
export function stonesForResult(key: ResultKey): AvailableStone[] {
  return availableStones.filter(
    (stone) => stone.available && (!stone.matchesResults || stone.matchesResults.includes(key)),
  );
}

/** The three future customisation steps, shown as a disabled preview today. */
export const customisationOptions = {
  cord: { label: 'Cord', choices: ['Light', 'Dark', 'Colour'] },
  details: { label: 'Details', choices: ['Gold', 'Silver', 'Surprise me'] },
  length: { label: 'Length', choices: ['Short', 'Medium', 'Long', 'Help me choose'] },
} as const;

export type CustomisationGroup = keyof typeof customisationOptions;
