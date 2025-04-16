import path from 'path';

import tailwindcss from "@tailwindcss/vite";
import checker from 'vite-plugin-checker';
import restart from 'vite-plugin-restart';

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

const testConfig = {
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
      'three/addons/loaders/RGBELoader.js'
    ],
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
  esbuild: {
    target: 'es6'
  },
  plugins: [
    restart({ restart: ['static/**',] }),
    checker({
      typescript: true,
    }),
    tailwindcss(),
  ],
};

export default mergeConfig(configDefaults, defineConfig(testConfig)); 