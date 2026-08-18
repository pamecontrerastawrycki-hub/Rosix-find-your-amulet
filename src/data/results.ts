/**
 * ROSIX — the seven results.
 * ---------------------------------------------------------------------------
 * The single source of truth for every result: copy, artwork, Shopify link and
 * accent colours. Nothing in this file is duplicated inside a component.
 *
 * To change a Shopify destination, edit `shopifyUrl` here and nowhere else.
 */

/** The seven scoreable outcomes. Also used as scoring keys in questions.ts. */
export type ResultKey =
  | 'plotTwist'
  | 'doNotDisturb'
  | 'gutFeeling'
  | 'mainCharacter'
  | 'noContact'
  | 'softPower'
  | 'newEra';

export interface ResultAccent {
  /** Soft wash used behind the artwork and cards. */
  tint: string;
  /** Mid accent — chips, rules, progress. */
  accent: string;
  /** Deeper stone colour — used sparingly for emphasis. */
  stone: string;
  /** Plain-language description of the accent, from the brief. */
  note: string;
}

export interface RosixResult {
  key: ResultKey;
  /** URL segment for shareable links: /result/<slug> */
  slug: string;
  title: string;
  /** Path under /public. Replace the file, keep the path — nothing else changes. */
  image: string;
  imageAlt: string;
  /** Three short lines. Rendered as separate lines, never joined. */
  oracle: string[];
  chapter: string;
  stone: string;
  concepts: [string, string, string];
  accent: ResultAccent;
  /** Exact Shopify product URL. Verified live against the store. */
  shopifyUrl: string;
}

export const results: Record<ResultKey, RosixResult> = {
  plotTwist: {
    key: 'plotTwist',
    slug: 'plot-twist',
    title: 'PLOT TWIST GIRL',
    image: '/assets/characters/01-plot-twist-girl.png',
    imageAlt:
      'Plot Twist Girl — a Rosix girl in a pale pink Y2K set with a leopard bag and a pink stone amulet.',
    oracle: [
      'Everything changed.',
      'Good. The old version was getting boring.',
      'What broke open made space for something better.',
    ],
    chapter: 'THE CRACK',
    stone: 'LEOPARD SKIN JASPER',
    concepts: ['Reinvention', 'Courage', 'New Beginnings'],
    accent: {
      tint: '#FFEAF2',
      accent: '#FF8FB8',
      stone: '#C4547F',
      note: 'Warm baby pink with a richer pink stone accent',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-crack-leopard-skin-jasper',
  },

  doNotDisturb: {
    key: 'doNotDisturb',
    slug: 'do-not-disturb',
    title: 'DO NOT DISTURB GIRL',
    image: '/assets/characters/02-do-not-disturb-girl.png',
    imageAlt:
      'Do Not Disturb Girl — a Rosix girl in a seafoam green set with headphones and a green stone amulet.',
    oracle: [
      'The world has had enough access to you.',
      'The quiet isn’t empty.',
      'It’s where your own voice comes back.',
    ],
    chapter: 'THE SILENCE',
    stone: 'GREEN JASPER',
    concepts: ['Intuition', 'Renewal', 'Inner Peace'],
    accent: {
      tint: '#E8F4EC',
      accent: '#8FC7A6',
      stone: '#3F7A5B',
      note: 'Pale seafoam with a deeper green stone accent',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-silence-green-jasper',
  },

  gutFeeling: {
    key: 'gutFeeling',
    slug: 'gut-feeling',
    title: 'GUT FEELING GIRL',
    image: '/assets/characters/03-gut-feeling-girl.png',
    imageAlt:
      'Gut Feeling Girl — a Rosix girl in a pale blue set holding a pink card, wearing a blue stone amulet.',
    oracle: [
      'You’ve asked enough people.',
      'You’ve replayed it enough times.',
      'The answer hasn’t changed.',
    ],
    chapter: 'THE QUESTION',
    stone: 'OCEAN JASPER',
    concepts: ['Clarity', 'Trust', 'Intuition'],
    accent: {
      tint: '#E7F0FA',
      accent: '#8FB8DD',
      stone: '#3D6B96',
      note: 'Baby light blue with a deeper stone-coloured accent',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-question-ocean-jasper',
  },

  mainCharacter: {
    key: 'mainCharacter',
    slug: 'main-character',
    title: 'MAIN CHARACTER GIRL',
    image: '/assets/characters/04-main-character-girl.png',
    imageAlt:
      'Main Character Girl — a Rosix girl in a pink pleated Y2K skirt set with a camera and a red stone amulet.',
    oracle: [
      'Your playing-small era is officially over.',
      'You don’t need another sign.',
      'Take up the space that was already yours.',
    ],
    chapter: 'THE FIRE',
    stone: 'RED JASPER',
    concepts: ['Confidence', 'Courage', 'Personal Power'],
    accent: {
      tint: '#FFE9EC',
      accent: '#FF8C95',
      stone: '#A83A2E',
      note: 'Pale cherry milk with a deep natural-red stone',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-fire-red-jasper',
  },

  noContact: {
    key: 'noContact',
    slug: 'no-contact',
    title: 'NO CONTACT GIRL',
    image: '/assets/characters/05-no-contact-girl.png',
    imageAlt:
      'No Contact Girl — a Rosix girl walking away in a peach set with sunglasses, phone and a fossil amulet.',
    oracle: [
      'You don’t need another conversation.',
      'You need your energy back.',
      'Let leaving be the closure.',
    ],
    chapter: 'THE LETTING GO',
    stone: 'CORAL FOSSIL',
    concepts: ['Release', 'Freedom', 'Grounding'],
    accent: {
      tint: '#FDEBE1',
      accent: '#F0A987',
      stone: '#B0603C',
      note: 'Baby peach with a richer terracotta fossil accent',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-letting-go-coral-fossil',
  },

  softPower: {
    key: 'softPower',
    slug: 'soft-power',
    title: 'SOFT POWER GIRL',
    image: '/assets/characters/06-soft-power-girl.png',
    imageAlt:
      'Soft Power Girl — a Rosix girl in a blush pink jumpsuit with a silver bag and a rose-grey amulet.',
    oracle: [
      'You don’t have to become harder to survive.',
      'Softness is not the opposite of power.',
      'It is how you choose to carry it.',
    ],
    chapter: 'THE SOFTNESS',
    stone: 'EXOTIC JASPER',
    concepts: ['Softness', 'Balance', 'Self-Compassion'],
    accent: {
      tint: '#F8ECEE',
      accent: '#D9A7B0',
      stone: '#8E6B74',
      note: 'Baby blush with muted rose-grey stone tones',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/softness-exotic-jasper',
  },

  newEra: {
    key: 'newEra',
    slug: 'new-era',
    title: 'NEW ERA GIRL',
    image: '/assets/characters/07-new-era-girl.png',
    imageAlt:
      'New Era Girl — a Rosix girl in a pearl pink romper with a silver suitcase and a rose quartz amulet.',
    oracle: [
      'You are not who you were.',
      'You are not yet who you will be.',
      'This in-between version deserves to be celebrated too.',
    ],
    chapter: 'THE BECOMING',
    stone: 'ROSE QUARTZ',
    concepts: ['Self Love', 'Transformation', 'Becoming'],
    accent: {
      tint: '#FDECF2',
      accent: '#F2AEC4',
      stone: '#C06E8C',
      note: 'Pearl pink with a richer translucent rose stone',
    },
    shopifyUrl: 'https://rosixamuletos.com/products/the-becoming-rose-quartz',
  },
};

/** Stable display order. Also the deterministic tie-break order — see scoring.ts. */
export const resultOrder: ResultKey[] = [
  'plotTwist',
  'doNotDisturb',
  'gutFeeling',
  'mainCharacter',
  'noContact',
  'softPower',
  'newEra',
];

export const resultList: RosixResult[] = resultOrder.map((key) => results[key]);

/** Look a result up from a shareable URL slug, e.g. "plot-twist". */
export function getResultBySlug(slug: string | undefined): RosixResult | undefined {
  if (!slug) return undefined;
  const needle = slug.toLowerCase();
  return resultList.find((result) => result.slug === needle);
}
