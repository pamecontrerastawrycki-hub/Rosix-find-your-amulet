/**
 * Shareable result links.
 *
 * Honours `siteConfig.routerMode`, so /result/plot-twist and
 * /#/result/plot-twist both produce a link that actually opens.
 */

import { siteConfig } from '../data/siteConfig';
import type { RosixResult } from '../data/results';

export function resultPath(slug: string): string {
  return `/result/${slug}`;
}

export function buildResultUrl(slug: string): string {
  const origin =
    siteConfig.siteUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const path = resultPath(slug);
  return siteConfig.routerMode === 'hash' ? `${origin}/#${path}` : `${origin}${path}`;
}

export function buildShareText(result: RosixResult): string {
  return `I got ${result.title} — ${result.chapter}, ${result.stone}. Which Rosix girl are you?`;
}
