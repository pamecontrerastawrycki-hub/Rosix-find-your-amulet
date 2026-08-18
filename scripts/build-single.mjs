/**
 * ROSIX — single-file preview build.
 * ---------------------------------------------------------------------------
 * Bundles the REAL app (same components, same data, same scoring) into one
 * self-contained HTML file with the CSS, JS and character artwork inlined as
 * data URIs. Nothing is loaded from the network except the web fonts.
 *
 * This exists purely for review — sending someone a working quiz they can open
 * on a phone without deploying anything. `npm run build` remains the real
 * production build.
 *
 *   npm run build:single   →  preview/rosix-quiz-preview.html
 *
 * Hash routing is forced on, so shareable result links work inside a single
 * file with no server rewrite behind it.
 */

import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-single');
const outDir = path.join(root, 'preview');
const outFile = path.join(outDir, 'rosix-quiz-preview.html');

/** Widths inlined into the preview. 1280 is dropped to keep the file light. */
const PREVIEW_WIDTHS = [400, 640, 900];

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log('[rosix:single] building…');
execFileSync(npx, ['vite', 'build', '--outDir', 'dist-single', '--base', './'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, VITE_ROUTER_MODE: 'hash' },
});

// --- Collect the character artwork as data URIs ----------------------------
const charDir = path.join(root, 'public', 'assets', 'characters');
const optimizedDir = path.join(charDir, 'optimized');

const dataUris = new Map(); // public path → data: URI

async function inlineWebp() {
  const files = await readdir(optimizedDir);
  for (const file of files) {
    const match = /-(\d+)\.webp$/.exec(file);
    if (!match || !PREVIEW_WIDTHS.includes(Number(match[1]))) continue;
    const buf = await readFile(path.join(optimizedDir, file));
    dataUris.set(
      `/assets/characters/optimized/${file}`,
      `data:image/webp;base64,${buf.toString('base64')}`,
    );
  }
}

/**
 * The original PNGs are ~3 MB each — far too heavy to inline. Every browser
 * that can open this preview supports WebP, so the <img> fallback points at
 * the 900px WebP instead. The real build always serves the true PNG.
 */
async function mapPngFallbacks() {
  const files = (await readdir(charDir)).filter((f) => f.toLowerCase().endsWith('.png'));
  for (const file of files) {
    const base = file.replace(/\.png$/i, '');
    const fallback = dataUris.get(`/assets/characters/optimized/${base}-900.webp`);
    if (fallback) dataUris.set(`/assets/characters/${file}`, fallback);
  }
}

await inlineWebp();
await mapPngFallbacks();

// --- Read the built assets --------------------------------------------------
const distFiles = await readdir(path.join(dist, 'assets'));
const jsName = distFiles.find((f) => f.endsWith('.js'));
const cssName = distFiles.find((f) => f.endsWith('.css'));
if (!jsName || !cssName) throw new Error('build output not found');

let js = await readFile(path.join(dist, 'assets', jsName), 'utf8');
const css = await readFile(path.join(dist, 'assets', cssName), 'utf8');

// Drop the 1280 sources from the baked-in manifest, then swap every remaining
// asset path for its data URI. Longest paths first so no path is a prefix of
// another mid-replacement.
// Vite minifies the imported JSON, so match on the path rather than on key
// quoting: any object literal that carries a -1280.webp source goes.
js = js.replace(/,?\{[^{}]*-1280\.webp"[^{}]*\}/g, '');

const paths = [...dataUris.keys()].sort((a, b) => b.length - a.length);
let replaced = 0;
for (const p of paths) {
  const before = js;
  js = js.split(JSON.stringify(p)).join(JSON.stringify(dataUris.get(p)));
  if (js !== before) replaced += 1;
}

const leftover = js.match(/\/assets\/characters\/[^"']*/g);
if (leftover) {
  console.warn(`[rosix:single] ${leftover.length} asset path(s) left un-inlined:`, [
    ...new Set(leftover),
  ]);
}

// --- Emit the page ----------------------------------------------------------
// No <!doctype>, <html>, <head> or <body>: this file is published as an
// Artifact, which supplies that skeleton itself.
const html = `<title>Which Rosix Girl Are You?</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#ffdcea" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=DM+Mono:wght@400;500&display=swap"
/>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

await mkdir(outDir, { recursive: true });
await writeFile(outFile, html);

const kb = Math.round(Buffer.byteLength(html) / 1024);
console.log(`[rosix:single] inlined ${replaced} assets`);
console.log(`[rosix:single] → ${path.relative(root, outFile)} (${kb} KB)`);
