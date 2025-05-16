import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import glsl from 'vite-plugin-glsl';
import restart from 'vite-plugin-restart';

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

export default defineConfig(({ mode }) => {
  const common = {
    root: 'src/',
    publicDir: 'static/',
    resolve: {
      alias: {
        '#': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: true,
      open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
    },
    optimizeDeps: {
      exclude: [
        'vitest',
        'lil-gui',
        'three/addons/loaders/DRACOLoader.js',
        'three/addons/loaders/FontLoader.js',
        'three/addons/loaders/GLTFLoader.js',
      ] 
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
      glsl({
        minify: mode === 'production',
      })
    ],
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
  }
  
  return common;
});