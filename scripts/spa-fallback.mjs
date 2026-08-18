/**
 * Copies dist/index.html to dist/404.html so shareable routes such as
 * /result/plot-twist resolve on static hosts that fall back to 404.html
 * (GitHub Pages, Cloudflare Pages, Surge). Netlify/Vercel use public/_redirects
 * and vercel.json instead — all three can coexist safely.
 */

import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = path.join(root, 'dist', 'index.html');

try {
  await access(index);
  await copyFile(index, path.join(root, 'dist', '404.html'));
  console.log('[rosix:build] dist/404.html written (SPA fallback)');
} catch {
  console.warn('[rosix:build] dist/index.html missing — skipped 404.html');
}
