import Menu from "@/layout/menu";

export class JourneyApp {

  private menu: Menu;
  
  constructor() {
    const container = document.body;
    this.menu = new Menu(container);
  }

  init() {
  }
}

window.addEventListener('load', () => {
  const journeyApp = new JourneyApp();
  journeyApp.init();
});