/**
 * ROSIX — character image optimiser.
 * ---------------------------------------------------------------------------
 * Reads every PNG in public/assets/characters/ and writes responsive WebP
 * derivatives next to them in public/assets/characters/optimized/, plus a
 * manifest the app imports at build time.
 *
 * IMPORTANT: the source PNGs are only ever READ. They are never rewritten,
 * cropped, recoloured or replaced — the artwork is the brand.
 *
 * Run automatically by `npm run build`, or on demand with `npm run images`.
 * If sharp is unavailable the build still succeeds: the app falls back to the
 * original PNG for any character with no manifest entry.
 */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'public', 'assets', 'characters');
const outDir = path.join(sourceDir, 'optimized');
const manifestPath = path.join(root, 'src', 'data', 'imageManifest.json');

/** Widths that cover a 1x–3x phone through a desktop half-column. */
const WIDTHS = [400, 640, 900, 1280];
const QUALITY = 82;

async function loadSharp() {
  try {
    const mod = await import('sharp');
    return mod.default;
  } catch {
    return null;
  }
}

/** Only rebuild a derivative when the source PNG is newer. */
async function isStale(src, dest) {
  if (!existsSync(dest)) return true;
  const [a, b] = await Promise.all([stat(src), stat(dest)]);
  return a.mtimeMs > b.mtimeMs;
}

/**
 * Never destroy a good manifest.
 *
 * The WebP derivatives and the manifest are committed, so a build machine that
 * cannot run sharp should still ship them. Overwriting the manifest with `{}`
 * here would silently drop every derivative and serve the 3 MB PNGs instead —
 * the site would still work, but it would be ~20x heavier on a phone.
 * So we only ever write an empty manifest when there genuinely isn't one.
 */
async function keepExistingManifest(reason) {
  if (existsSync(manifestPath)) {
    console.warn(`[rosix:images] ${reason} — keeping the committed manifest and its WebP derivatives.`);
    return;
  }
  console.warn(`[rosix:images] ${reason} and no manifest exists — falling back to the original PNGs.`);
  await writeFile(manifestPath, '{}\n');
}

async function main() {
  if (!existsSync(sourceDir)) {
    console.warn(`[rosix:images] ${path.relative(root, sourceDir)} not found — skipping.`);
    await keepExistingManifest('the characters folder is missing');
    return;
  }

  const files = (await readdir(sourceDir))
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort();

  if (files.length === 0) {
    console.warn('[rosix:images] no PNGs found.');
    await keepExistingManifest('there are no source PNGs');
    return;
  }

  const sharp = await loadSharp();
  const manifest = {};

  if (!sharp) {
    console.warn('[rosix:images] sharp unavailable.');
    await keepExistingManifest('sharp could not be loaded');
    return;
  }

  await mkdir(outDir, { recursive: true });

  for (const file of files) {
    const src = path.join(sourceDir, file);
    const base = file.replace(/\.png$/i, '');
    const image = sharp(src);
    const { width = 0, height = 0 } = await image.metadata();
    const sources = [];

    for (const target of WIDTHS) {
      if (target > width) continue;
      const outName = `${base}-${target}.webp`;
      const dest = path.join(outDir, outName);

      if (await isStale(src, dest)) {
        await sharp(src)
          .resize({ width: target, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(dest);
      }

      sources.push({ width: target, src: `/assets/characters/optimized/${outName}` });
    }

    manifest[`/assets/characters/${file}`] = {
      width,
      height,
      sources,
    };

    const kb = Math.round((await stat(src)).size / 1024);
    console.log(`[rosix:images] ${file} (${width}x${height}, ${kb}KB) → ${sources.length} webp`);
  }

  const previous = existsSync(manifestPath) ? await readFile(manifestPath, 'utf8') : '';
  const next = `${JSON.stringify(manifest, null, 2)}\n`;
  if (previous !== next) await writeFile(manifestPath, next);

  console.log(`[rosix:images] manifest → ${path.relative(root, manifestPath)}`);
}

main().catch((error) => {
  console.error('[rosix:images] failed:', error);
  process.exitCode = 1;
});
