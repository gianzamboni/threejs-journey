import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import checker from 'vite-plugin-checker';
//mport eslint from 'vite-plugin-eslint';
import restart from 'vite-plugin-restart'

import {configDefaults, defineConfig, mergeConfig } from 'vitest/config'

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
      external: [/\.test\.(ts|js)$/], // Exclude test files
    }
  },
  test: {
    root: './',
    globals: true,
    environment: "jsdom",
    setupFiles: ['./vitest/vitest.setup.ts'],
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