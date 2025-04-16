import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import restart from 'vite-plugin-restart';

// Custom plugin to filter out test files
function excludeTestFiles() {
  return {
    name: 'exclude-test-files',
    resolveId(id) {
      // Exclude test files by checking file paths
      if (
        id.includes('.test.') || 
        id.includes('.spec.') || 
        id.includes('/tests/') ||
        id.includes('\\tests\\')
      ) {
        return { id: '@excluded-test', external: true };
      }
      return null;
    },
    load(id) {
      if (id === '@excluded-test') {
        return 'export default {}';
      }
      return null;
    }
  };
}

const config = {
  root: 'src/', // Sources files (typically where index.html is)
  publicDir: 'static/', // Path from "root" to static assets (files that are served as they are)
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src') // Alias # to src/
    }
  },
  server: {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: '../dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
      }
    }
  },
  optimizeDeps: {
    entries: [
      'src/**/*.{js,ts}',
    ],
    // Add problematic dependencies to exclude
    exclude: [
      'lil-gui',
      'three/addons/loaders/DRACOLoader.js',
      'three/addons/loaders/FontLoader.js',
      'three/addons/loaders/GLTFLoader.js',
      'three/addons/loaders/RGBELoader.js'
    ],
  },
  esbuild: {
    target: 'es6'
  },
  plugins: [
    excludeTestFiles(), // Custom plugin to exclude test files
    restart({ restart: ['static/**',] }), // Restart server on static file change
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    tailwindcss(),
  ],
};

export default defineConfig(config); 