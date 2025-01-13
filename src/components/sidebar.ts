import { THEME } from "@/theme";

type SideBarOptions = {
  buttonTitle: string;
};

export default class SideBar {

  private sidePanel: HTMLElement;
  private overlay: HTMLElement;
  private sideBarContent: HTMLElement;

  constructor(parent: HTMLElement, options: SideBarOptions) {
    this.sidePanel = this.createPanel();
    parent.appendChild(this.sidePanel);

    this.overlay = this.createOverlay();
    parent.appendChild(this.overlay);

    this.sideBarContent = this.createBody();
    this.sidePanel.appendChild(this.sideBarContent);

    const button = this.createButton(options.buttonTitle);
    parent.appendChild(button);
  }

  addContent(content: HTMLElement) {
    this.sideBarContent.appendChild(content);
  }

  private createBody() {
    const body = document.createElement('div');
    body.className = 'relative flex flex-col h-full max-h-full px-3 pt-3';
    return body;
  }

  private createPanel() {
    const panel = document.createElement('div');
    panel.className = `w-64 transition-all duration-300 transform h-full -translate-x-full fixed top-0 start-0 bottom-0 z-[60] border-e ${THEME.background} ${THEME.border} ${THEME.text}`;
    return panel;
  }

  private createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = `fixed top-0 start-0 bottom-0 end-0 z-[50] bg-black bg-opacity-50 hidden`;
    overlay.onclick = this.toggleSidePanel.bind(this);
    return overlay;
  }

  private createButton(buttonTitle: string) {
    const button = document.createElement('button');
    button.className = `flex py-2 px-3 m-5 items-center gap-x-2 border  font-medium  rounded-md shadow-sm ${THEME.background} ${THEME.border} ${THEME.text} ${THEME.hover}`;
    button.innerHTML = buttonTitle;
    button.onclick = this.toggleSidePanel.bind(this);
    return button;
  }

  toggleSidePanel() {
    this.overlay.classList.toggle('hidden');
    this.sidePanel.classList.toggle('-translate-x-full');
  }
}