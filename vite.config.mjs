import { defineConfig } from 'vite';

// Import the specific configurations
import devConfig from './vite.dev.config.mjs';
import testConfig from './vite.test.config.mjs';

// Determine which configuration to use based on the command
export default defineConfig(({ mode }) => {
  // When running tests, use the test config
  if (mode === 'test') {
    return testConfig;
  }
  
  // For development and production, use the dev/prod config
  return devConfig;
});