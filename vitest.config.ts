import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src')
    }
  },
  test: {
    root: './src',
    globals: true,
    environment: "jsdom",
    setupFiles: ['../vitest/vitest.setup.ts'],
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/**',
        '**/*.d.ts',
        '**/types/**'
      ],
      all: true,
      include: ['app/**/*.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
  },
});
