/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />

import '../pollyfills/symbol-pollyfill';
import { App } from "#/app";
import { qualityFromString } from './app/layout/quality-selector';
// Initialize the app when the window loads
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quality = urlParams.get('quality');
  const app = new App(qualityFromString(quality));
  app.init();
});
