import restart from 'vite-plugin-restart'
import checker from 'vite-plugin-checker'

import path from 'path';
export default {
  root: 'src/', // Sources files (typically where index.html is)
  publicDir: 'static/', // Path from "root" to static assets (files that are served as they are)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Alias @ to src/
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
    sourcemap: true // Add sourcemap
  },
  plugins:
    [
      restart({ restart: ['static/**',] }), // Restart server on static file change
      checker({
        // e.g. use TypeScript check
        typescript: true,
      }),
    ],
}