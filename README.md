# WHICH ROSIX GIRL ARE YOU?

An interactive Y2K product-discovery quiz for **Rosix Amuletos**.
Five questions, one chapter, one stone — then a link to the exact Shopify
product that inspired the result.

> Found you for a reason.

This is **not** a store. It does not replace, modify or read from the Shopify
theme. Its only relationship to Shopify is seven outbound product links.

---

## Contents

- [Run it](#run-it)
- [Where the images go](#where-the-images-go)
- [Change the quiz questions](#change-the-quiz-questions)
- [Change result copy](#change-result-copy)
- [Update the Shopify URLs](#update-the-shopify-urls)
- [Turn on custom amulets](#turn-on-custom-amulets)
- [Add stone inventory](#add-stone-inventory)
- [Change the deposit URL](#change-the-deposit-url)
- [Analytics](#analytics)
- [Build and deploy](#build-and-deploy)
- [Placeholders still outstanding](#placeholders-still-outstanding)
- [Project structure](#project-structure)

---

## Run it

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:5173
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Optimises images, typechecks, builds to `dist/` |
| `npm run build:fast` | Build without re-running the image pipeline |
| `npm run preview` | Serve the production build locally |
| `npm run images` | Regenerate WebP derivatives + image manifest |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Scoring test suite (Vitest) |
| `npm run verify` | lint + typecheck + test |

---

## Where the images go

```
public/assets/characters/
├── 00-cover-girl.png          ← intro screen
├── 01-plot-twist-girl.png
├── 02-do-not-disturb-girl.png
├── 03-gut-feeling-girl.png
├── 04-main-character-girl.png
├── 05-no-contact-girl.png
├── 06-soft-power-girl.png
└── 07-new-era-girl.png
```

**All eight are already in place.** To replace one, overwrite the file with the
same name and run `npm run images`. Nothing else changes.

How the artwork is treated:

- **Never cropped.** Every image renders with `object-fit: contain` inside a
  square box, so heads, shoes, bags and bracelets always survive.
- **Never regenerated or edited.** The optimiser only ever *reads* the PNGs.
  The originals stay in the repo untouched.
- **Transparency is preserved** if a future file has an alpha channel. The
  current eight are flat RGB on `#FDF4F9`, which is exactly the site's canvas
  colour, so they blend seamlessly.
- **Responsive.** `npm run images` writes WebP derivatives at 400/640/900/1280px
  into `public/assets/characters/optimized/` and records them in
  `src/data/imageManifest.json`. 24 MB of PNGs become ~1.1 MB of WebP; a phone
  downloads roughly 11–22 KB per character.
- **Only the cover is preloaded.** Result artwork is lazy-loaded.
- **A missing file degrades gracefully.** If an image 404s or hasn't been added
  yet, the quiz renders a labelled placeholder showing the character name and
  the exact path it expects — no broken image, no substitute illustration, and
  the rest of the result still works.

If `sharp` can't install in your environment, the build still succeeds and the
app simply serves the original PNGs.

---

## Change the quiz questions

Everything lives in **`src/data/questions.ts`** — the only place scoring weights
are declared.

```ts
{
  id: 'q1',
  prompt: 'WHAT CHAPTER ARE YOU IN RIGHT NOW?',
  options: [
    { id: 'A', label: 'I’m outgrowing everything.', scores: { newEra: 2, plotTwist: 1 } },
    // …exactly five options
  ],
}
```

- Edit `prompt` / `label` to change wording.
- Edit `scores` to change weights. Keys must be one of the seven result keys.
- Keep **exactly five options per question** — the test suite enforces it.
- Adding a sixth question just works: the `01 / 05` counter and progress bar
  read from the array length.

Run `npm test` after any edit. The suite runs all 3,125 possible answer paths
and fails if a result becomes unreachable.

### How scoring works

Points add up per result. Ties are broken in this order, and never randomly:

1. Most `+2` primary selections among the tied results.
2. The most recent answer that scored one of the still-tied results.
3. `TIE_BREAK_ORDER` in `src/lib/scoring.ts` — deterministic configuration.

The visitor never sees a score.

---

## Change result copy

Everything for all seven results lives in **`src/data/results.ts`**: title,
oracle message, chapter, stone, the three concepts, accent colours, artwork path
and the Shopify link. No result content is duplicated in any component.

The closing line **GIRL, YOU ALREADY KNOW.** is shared by all seven and lives in
`siteConfig.result.closingPhrase`.

Intro copy, loading lines, button labels and the modal text are in
**`src/data/siteConfig.ts`**.

---

## Update the Shopify URLs

One field per result in `src/data/results.ts`:

```ts
shopifyUrl: 'https://rosixamuletos.com/products/the-crack-leopard-skin-jasper',
```

All seven were verified live against the Rosix Amuletos store:

| Result | Chapter | Product handle | Status |
| --- | --- | --- | --- |
| Plot Twist | The Crack | `the-crack-leopard-skin-jasper` | ✅ active |
| Do Not Disturb | The Silence | `the-silence-green-jasper` | ✅ active |
| Gut Feeling | The Question | `the-question-ocean-jasper` | ✅ active |
| Main Character | The Fire | `the-fire-red-jasper` | ✅ active |
| No Contact | The Letting Go | `the-letting-go-coral-fossil` | ✅ active |
| Soft Power | The Softness | `softness-exotic-jasper` | ✅ active |
| New Era | The Becoming | `the-becoming-rose-quartz` | ✅ active |

> ⚠️ **Every one of these is a one-of-one piece with inventory of 1.** When a
> chapter sells, its `KEEP THIS CHAPTER` button will land on a sold-out product
> page. Decide what should happen then — point the URL at a collection, a
> restock page, or the custom flow — and edit `shopifyUrl` for that result.

Note that Soft Power's handle is `softness-exotic-jasper` (no `the-` prefix),
unlike the other six. That matches the live store.

---

## Turn on custom amulets

In `src/data/siteConfig.ts`:

```ts
custom: {
  customAvailable: false,   // ← flip to true
  customUrl: '',            // ← where MAKE IT YOURS should go
}
```

- `customAvailable: false` → **MAKE IT YOURS** opens the "your stone is still
  being found" modal.
- `customAvailable: true` → **MAKE IT YOURS** navigates to `customUrl` instead.

`customUrl` supports a `{result}` token, replaced with the result key:

```ts
customUrl: '/customize?result={result}'
customUrl: 'https://rosixamuletos.com/products/custom-amulet?chapter={result}'
```

Leave `customUrl` empty and it falls back to the internal
`/customize?result=<key>` placeholder page. Absolute `http(s)` URLs open in a new
tab; internal paths route in-app. **No component changes are required.**

The `/customize` page is deliberately an explainer, not a configurator. The cord
/ details / length choices are rendered as inert text, not controls, so nothing
can be clicked or mistaken for a working selection while the flow is off.

---

## Add stone inventory

`src/data/availableStones.ts` is prepared but intentionally **empty**. Nothing in
the live quiz reads it yet. Add real one-of-one stones like this:

```ts
export const availableStones: AvailableStone[] = [
  {
    id: 'ST-001',
    name: 'Rose Quartz',
    image: '/assets/stones/ST-001.webp',   // put the photo in public/assets/stones/
    energy: ['Self Love', 'Softness', 'Becoming'],
    available: true,
    shopifyVariantId: '',
    depositUrl: '',
    matchesResults: ['newEra'],            // which quiz results offer this stone
  },
];
```

`stonesForResult(key)` returns the still-available stones for a result. Adding
stones never requires redesigning the quiz.

---

## Change the deposit URL

`siteConfig.custom.depositUrl` is the fixed reservation deposit link used by the
future flow. An individual stone can override it with its own `depositUrl`.

**No payment, cart or checkout is implemented anywhere in this app**, and no
Shopify product was created for it.

---

## Analytics

`src/lib/analytics.ts` fires these events:

`quiz_started` · `question_answered` · `quiz_completed` · `result_viewed` ·
`shop_chapter_clicked` · `make_it_yours_clicked` · `result_shared`

No vendor is installed and no network request is made. Events go to
`window.dataLayer` if it exists, and log to the console in development. To wire
up GA4, Meta, PostHog or Shopify later, fill in the single `forwardEvent()`
function — no component changes needed.

---

## Build and deploy

```bash
npm run build     # → dist/
```

The output is a static site. Host it anywhere and link it from Instagram and
Shopify — it does not need to live on the Shopify domain.

Shareable result routes (`/result/plot-twist`) need an SPA rewrite. The build
covers the common hosts automatically:

- **Netlify / Cloudflare Pages** — `public/_redirects`
- **Vercel** — `vercel.json`
- **GitHub Pages / Surge** — `dist/404.html` (copied from `index.html` at build)

On a host that can't rewrite at all, set `routerMode: 'hash'` in
`src/data/siteConfig.ts`. Links become `/#/result/plot-twist` and work
everywhere; sharing keeps working automatically.

---

## Placeholders still outstanding

| Where | Value | What's needed |
| --- | --- | --- |
| `siteConfig.siteUrl` | `''` | The quiz's own domain/subdomain. Empty falls back to `window.location.origin`, which is correct in most deployments — set it if the site is ever served from more than one origin. |
| `siteConfig.instagramUrl` | `https://www.instagram.com/rosixamuletos/` | **Unverified guess.** Confirm the real handle — this is where "TELL ME WHEN" currently sends people. |
| `siteConfig.custom.customUrl` | `''` | Destination for MAKE IT YOURS once custom amulets are live. |
| `siteConfig.custom.modal.notifyUrl` | `''` | A real waitlist / signup link. While empty, "TELL ME WHEN" falls back to `instagramUrl`. |
| `siteConfig.custom.depositUrl` | `''` | The reservation deposit link. |
| `availableStones` | `[]` | Real stone inventory. |
| `public/assets/stones/` | empty | Stone photographs, when they exist. |
| Open Graph image | cover girl derivative | Fine as-is; swap for a purpose-made share card if you want one. |

Everything else — all eight illustrations, all seven Shopify links, every line
of copy — is final.

---

## Project structure

```
public/assets/characters/     the eight PNGs (originals, untouched)
        └── optimized/        generated WebP derivatives
src/
├── data/
│   ├── questions.ts          the five questions + ALL scoring weights
│   ├── results.ts            the seven results (copy, art, Shopify links)
│   ├── siteConfig.ts         brand copy, feature flags, outbound links
│   ├── availableStones.ts    future stone inventory (empty, inactive)
│   └── imageManifest.json    generated — do not edit by hand
├── lib/
│   ├── scoring.ts            weighted scoring + 3-stage tie-breaking
│   ├── scoring.test.ts       15 tests, all 3,125 answer paths
│   ├── analytics.ts          event hooks, no vendor
│   ├── images.ts             responsive sources + PNG fallback
│   ├── share.ts              shareable result URLs
│   └── useReducedMotion.ts
├── components/               IntroScreen, QuizProgress, QuestionCard,
│                             LoadingReveal, ResultScreen, CharacterArtwork,
│                             ShopifyCTA, CustomModal, ShareButton,
│                             RestartButton, WindowFrame, Sparkle
├── routes/                   QuizPage, ResultPage, CustomizePage
└── styles/                   tokens, base, animations, screens
```

### Accessibility & UX notes

- Mobile-first; verified with no horizontal scroll from 320 px upward.
- Every control is at least 44 px tall; most are 48 px+.
- Fully keyboard operable, with visible focus rings. When the question changes,
  focus moves to the new question heading so keyboard and screen-reader users
  are not dropped back to the top of the page.
- Answers are preserved when navigating Back, and the previous choice is shown
  as selected.
- Options lock briefly on tap, so a double-tap can't answer twice.
- `prefers-reduced-motion` disables every decorative animation and shortens the
  reveal to 0.7 s.
- No sound, no autoplay, no video, no account, no personal data collected, and
  nothing is written to storage.
- A full run takes about 25 seconds; the reveal itself is 2.2 s.
