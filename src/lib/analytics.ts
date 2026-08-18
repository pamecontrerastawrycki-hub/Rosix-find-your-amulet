/**
 * ROSIX — analytics hooks.
 * ---------------------------------------------------------------------------
 * No analytics vendor is installed and no network request is made. Events are
 * pushed to `window.dataLayer` (if present) and logged in development, so a
 * real destination can be wired up later in ONE place: `forwardEvent`.
 *
 * To connect GA4 / Meta / PostHog / Shopify later, fill in `forwardEvent`.
 * No component needs to change.
 */

export type AnalyticsEvent =
  | 'quiz_started'
  | 'question_answered'
  | 'quiz_completed'
  | 'result_viewed'
  | 'shop_chapter_clicked'
  | 'make_it_yours_clicked'
  | 'result_shared';

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

interface DataLayerWindow extends Window {
  dataLayer?: unknown[];
}

/**
 * The single integration point.
 *
 * GA4:      window.gtag?.('event', event, payload)
 * Meta:     window.fbq?.('trackCustom', event, payload)
 * PostHog:  window.posthog?.capture(event, payload)
 * Shopify:  window.ShopifyAnalytics?.lib.track(event, payload)
 */
function forwardEvent(event: AnalyticsEvent, payload: AnalyticsPayload): void {
  if (typeof window === 'undefined') return;

  const win = window as DataLayerWindow;
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({ event, ...payload });
  }

  if (import.meta.env.DEV) {
    console.info('[rosix:analytics]', event, payload);
  }
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  try {
    forwardEvent(event, { ...payload, timestamp: Date.now() });
  } catch {
    // Analytics must never break the quiz.
  }
}
