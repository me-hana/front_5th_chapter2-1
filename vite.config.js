import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const isCI = process.env.CI === 'true';

export default defineConfig({
  // base: isCI ? '' : '/front_5th_chapter2-1/',
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: {
        basic: path.resolve(__dirname, 'index.basic.html'),
        advanced: path.resolve(__dirname, 'index.advanced.html'),
        retry: path.resolve(__dirname, 'index.retry.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
