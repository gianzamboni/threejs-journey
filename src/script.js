import 'preline/preline.js';
import { Menu } from './app/menu';

export class JourneyApp {
  constructor() {
    this.menu = new Menu();
  }
}

window.addEventListener('load', () => {
  const journeyApp = new JourneyApp();
});