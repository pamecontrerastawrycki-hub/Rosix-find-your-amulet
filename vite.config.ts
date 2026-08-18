import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The character PNGs live in /public and are copied verbatim — never inlined.
    assetsInlineLimit: 2048,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
