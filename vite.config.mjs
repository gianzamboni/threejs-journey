import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import { visualizer } from 'rollup-plugin-visualizer';
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
    },
    esbuild: {
      target: 'es6',
      treeShaking: true,
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
      }),
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ],
    build: {
      outDir: '../dist', // Output in the dist/ folder
      emptyOutDir: true, // Empty the folder first
      sourcemap: true, // Add sourcemap
      minify: 'terser', // Use terser for better minification
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: true,
        format: {
          comments: false
        }
      },
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/index.html'),
        },
        output: {
          manualChunks: {
            'three': ['three'],
            'vendor': ['gsap', 'lil-gui', 'cannon-es'],
          },
          format: 'es',
          generatedCode: {
            preset: 'es2015',
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true
          }
        }, 
        treeshake: {
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
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