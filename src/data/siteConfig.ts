/**
 * ROSIX — WHICH ROSIX GIRL ARE YOU?
 * ---------------------------------------------------------------------------
 * Global site configuration. Brand copy, feature flags and outbound links live
 * here so they can be changed WITHOUT touching a single component.
 *
 * Anything marked `PLACEHOLDER` is not final and is listed in the README.
 */

/**
 * The shape of the config. Written out explicitly (rather than inferred with
 * `as const`) so that the flags below are real `boolean` / `string` types —
 * flipping `customAvailable` to true must never require a code change.
 */
export interface SiteConfig {
  siteName: string;
  brandName: string;
  siteUrl: string;
  shopUrl: string;
  instagramUrl: string;
  intro: {
    title: string;
    primaryLine: string;
    secondaryLine: string;
    startLabel: string;
    meta: string[];
    coverImage: string;
    coverAlt: string;
  };
  quizInstruction: string;
  loading: {
    durationMs: number;
    reducedDurationMs: number;
    lines: string[];
  };
  result: {
    eyebrow: string;
    closingPhrase: string;
    primaryCtaLabel: string;
    primaryCtaSupport: string;
    secondaryCtaLabel: string;
    shareLabel: string;
    restartLabel: string;
    findYourOwnLabel: string;
  };
  custom: {
    customAvailable: boolean;
    customUrl: string;
    modal: {
      title: string;
      body: string[];
      buttonLabel: string;
      notifyUrl: string;
    };
    depositUrl: string;
    depositLabel: string;
  };
  routerMode: 'history' | 'hash';
}

export const siteConfig: SiteConfig = {
  /** Browser tab / share title. */
  siteName: 'Which Rosix Girl Are You?',
  brandName: 'ROSIX AMULETOS',

  /**
   * Canonical origin used to build shareable result links.
   * Set this to wherever the quiz is deployed (NOT the Shopify store) so that
   * shared links resolve. Leaving it empty falls back to `window.location.origin`,
   * which is correct in most deployments.
   * PLACEHOLDER — update after the quiz has its own domain/subdomain.
   */
  siteUrl: '',

  /** Shopify storefront. Read-only from this app: we only ever link out. */
  shopUrl: 'https://rosixamuletos.com',

  /** Instagram profile — the "TELL ME WHEN" fallback in the custom modal. */
  instagramUrl: 'https://www.instagram.com/rosix.amuletos/',

  // --- Intro screen -------------------------------------------------------
  intro: {
    title: 'WHICH ROSIX GIRL ARE YOU?',
    primaryLine: 'GIRL, DON’T OVERTHINK IT.',
    secondaryLine: 'Your first instinct usually knows.',
    startLabel: 'START',
    meta: ['ROSIX DIGITAL ORACLE', 'FILE: RW-GIRL-QUIZ', 'COLLECTED IN BALI'],
    coverImage: '/assets/characters/00-cover-girl.png',
    coverAlt:
      'A Rosix girl in a brown Y2K outfit with a chunky amulet, sunglasses and a digital camera.',
  },

  /** Shown once, above question 01. */
  quizInstruction: 'Choose fast. Your first answer usually knows.',

  // --- Loading / reveal ---------------------------------------------------
  loading: {
    /** Total reveal duration in ms. Brief says 1.8–2.5s. */
    durationMs: 2200,
    /** Duration used when the visitor prefers reduced motion. */
    reducedDurationMs: 700,
    lines: [
      'READING YOUR CHOICES…',
      'CHECKING YOUR CURRENT CHAPTER…',
      'MATCHING YOUR STONE…',
      'SOMETHING FOUND YOU.',
    ],
  },

  // --- Result screen ------------------------------------------------------
  result: {
    eyebrow: 'YOUR ROSIX GIRL',
    /** Every result ends with this line. Non-negotiable brand sign-off. */
    closingPhrase: 'GIRL, YOU ALREADY KNOW.',
    primaryCtaLabel: 'KEEP THIS CHAPTER',
    primaryCtaSupport: 'Get the original amulet that inspired your result.',
    secondaryCtaLabel: 'MAKE IT YOURS',
    shareLabel: 'SHARE MY ROSIX GIRL',
    restartLabel: 'RETAKE THE QUIZ',
    /** Shown instead of "retake" when a visitor lands on a shared result link. */
    findYourOwnLabel: 'FIND YOUR ROSIX GIRL',
  },

  // --- Custom amulets (future) -------------------------------------------
  custom: {
    /**
     * MASTER SWITCH for the custom amulet flow.
     *
     * false → "MAKE IT YOURS" opens the on-brand "coming soon" modal.
     * true  → "MAKE IT YOURS" navigates straight to `customUrl`
     *         (or to /customize?result=<key> when customUrl is empty).
     *
     * No component changes are needed to flip this.
     */
    customAvailable: false,

    /**
     * Destination once `customAvailable` is true. May be an internal path
     * ("/customize") or an absolute Shopify URL. Supports the `{result}` token,
     * which is replaced with the result key, e.g.
     *   "/customize?result={result}"
     *   "https://rosixamuletos.com/products/custom-amulet?chapter={result}"
     * PLACEHOLDER — empty until the custom flow is live.
     */
    customUrl: '',

    /** Copy for the "not yet" modal. */
    modal: {
      title: 'YOUR STONE IS STILL BEING FOUND.',
      body: [
        'Custom Rosix amulets are coming soon.',
        'Your result will stay here until the right stone arrives.',
      ],
      buttonLabel: 'TELL ME WHEN',
      /**
       * Where "TELL ME WHEN" goes. Leave empty to fall back to `instagramUrl`.
       * PLACEHOLDER — swap for a real waitlist/Shopify form when one exists.
       */
      notifyUrl: '',
    },

    /**
     * Fixed reservation deposit taken through Shopify in the future flow.
     * PLACEHOLDER — no payment is implemented anywhere in this app.
     */
    depositUrl: '',
    depositLabel: 'RESERVE MY STONE',
  },

  // --- Routing ------------------------------------------------------------
  /**
   * 'history' → clean URLs (/result/plot-twist). Needs an SPA rewrite on the
   *             host; `npm run build` emits _redirects, vercel.json and 404.html.
   * 'hash'    → /#/result/plot-twist. Works on any static host that cannot
   *             rewrite, including the single-file preview build.
   *
   * Change the fallback below to change the default. The env var exists only so
   * `npm run build:single` can override it without editing this file.
   */
  routerMode: import.meta.env.VITE_ROUTER_MODE === 'hash' ? 'hash' : 'history',
};
