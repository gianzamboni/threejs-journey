import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import checker from 'vite-plugin-checker';
//mport eslint from 'vite-plugin-eslint';
import restart from 'vite-plugin-restart'

import {configDefaults, defineConfig, mergeConfig } from 'vitest/config'

// Pattern to match all test files and folders
const testFilePattern = /(\.(test|spec)\.(ts|js)$)|(\/tests\/)/;

const config = {
  root: 'src/', // Sources files (typically where index.html is)
  publicDir: 'static/', // Path from "root" to static assets (files that are served as they are)
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src') // Alias # to src/
    }
  },
  server:
  {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
  },
  build:
  {
    outDir: '../dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      external: [testFilePattern], // Exclude test files and folders
    }
  },
  optimizeDeps: {
    exclude: ['vitest'],
    // Skip test files in pre-bundling
    entries: [
      'src/**/*.{js,ts}',
      '!src/**/*.{test,spec}.{js,ts}',
      '!src/**/tests/**'
    ]
  },
  test: {
    root: './',
    globals: true,
    environment: "jsdom",
    setupFiles: ['./vitest/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest/vitest.setup.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/tests/**',
        '**/types/**'
      ],
      all: true,
      include: ['src/**/*.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  },
  esbuild: {
    target: 'es6'
  },
  plugins:
    [
      //eslint(),
      restart({ restart: ['static/**',] }), // Restart server on static file change
      checker({
        // e.g. use TypeScript check
        typescript: true,
      }),
      tailwindcss(),
      //eslint({ include: ['src/**/*.js', 'src/**/*.ts'] }) // Lint JS and TS files
    ],
}
export default mergeConfig(configDefaults, defineConfig(config))