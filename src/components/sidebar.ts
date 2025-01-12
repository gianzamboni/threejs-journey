import { THEME } from "@/theme";
import { Button } from "./button";

type SideBarOptions = {
  buttonTitle: string;
};

export default class SideBar {

  private sidePanel: HTMLElement;
  private overlay: HTMLElement;

  constructor(parent: HTMLElement, options: SideBarOptions) {
    this.sidePanel = document.createElement('div');
    this.sidePanel.className = `w-64 transition-all duration-300 transform h-full -translate-x-full fixed top-0 start-0 bottom-0 z-[60] border-e ${THEME.background} ${THEME.border} ${THEME.text}`;

    parent.appendChild(this.sidePanel);

    this.overlay = document.createElement('div');
    this.overlay.className = `fixed top-0 start-0 bottom-0 end-0 z-[50] bg-black bg-opacity-50 hidden`;
    this.overlay.onclick = this.toggleSidePanel.bind(this);
    
    parent.appendChild(this.overlay);

    const button = new Button(options.buttonTitle, {
      onClick: this.toggleSidePanel.bind(this),
    });
    button.addTo(parent);
  }


  toggleSidePanel() {
    this.overlay.classList.toggle('hidden');
    this.sidePanel.classList.toggle('-translate-x-full');
  }
}