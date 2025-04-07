/// <reference types="vite/client" />
import '../pollyfills/symbol-pollyfill';
import { App } from "#/app";

// Initialize the app when the window loads
window.addEventListener('load', () => {
  const app = new App();
  app.init();
});
