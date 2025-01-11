import { Menu } from './app/menu';
import { StateManager } from './app/state-manager';
export class JourneyApp {
  constructor() {
    this.stateManager = new StateManager();
    this.menu = new Menu(this.stateManager);
  }

  init() {
    this.stateManager.init();
  }
}

window.addEventListener('load', () => {
  const journeyApp = new JourneyApp();
  window.HSStaticMethods.autoInit();

  journeyApp.init();
});