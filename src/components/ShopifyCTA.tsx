/**
 * "KEEP THIS CHAPTER" — the one commercial moment in the whole experience.
 *
 * Opens the exact Shopify product URL for the result. This app never writes to
 * Shopify: it only ever links out.
 */

import { siteConfig } from '../data/siteConfig';
import type { RosixResult } from '../data/results';
import { track } from '../lib/analytics';

interface ShopifyCTAProps {
  result: RosixResult;
}

export function ShopifyCTA({ result }: ShopifyCTAProps) {
  return (
    <>
      <a
        className="btn btn--primary btn--block"
        href={result.shopifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track('shop_chapter_clicked', {
            result: result.key,
            chapter: result.chapter,
            stone: result.stone,
            url: result.shopifyUrl,
          })
        }
      >
        {siteConfig.result.primaryCtaLabel}
        <span className="sr-only"> — opens the Rosix shop in a new tab</span>
      </a>
      <p className="result__cta-support">{siteConfig.result.primaryCtaSupport}</p>
    </>
  );
}
