import { Overlay } from "#/app/components/overlay";
import { CSS_CLASSES } from "#/theme";

type SideBarOptions = {
  buttonTitle: string;
};

export default class SideBar {

  private sidePanel: HTMLElement;
  private overlay: Overlay;
  private sideBarContent: HTMLElement;

  constructor(options: SideBarOptions) {
    this.sidePanel = this.createPanel();
    document.body.appendChild(this.sidePanel);

    this.overlay = new Overlay();
    this.overlay.addEventListener('click', this.toggleSidePanel.bind(this));

    this.sideBarContent = this.createBody();
    this.sidePanel.appendChild(this.sideBarContent);

    const button = this.createButton(options.buttonTitle);
    document.body.appendChild(button);
  }

  addContent(content: HTMLElement) {
    this.sideBarContent.appendChild(content);
  }

  get opened() {
    return this.overlay.opened;
  }

  private createBody() {
    const body = document.createElement('div');
    body.className = `relative flex flex-col h-full max-h-full px-3 pt-3 ${CSS_CLASSES.main_layout_index}`;
    return body;
  }

  private createPanel() {
    const panel = document.createElement('div');
    panel.className = `w-64 transition-all duration-300 transform h-full -translate-x-full fixed top-0 start-0 ${CSS_CLASSES.sidebar_index} border-e ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text}`;
    return panel;
  }

  private createButton(buttonTitle: string) {
    const button = document.createElement('button');
    button.className = `fixed cursor-pointer flex py-2 px-3 m-5 items-center gap-x-2 border  font-medium  rounded-md shadow-xs ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text} ${CSS_CLASSES.hover} ${CSS_CLASSES.main_layout_index}`;
    button.innerHTML = buttonTitle;
    button.onclick = this.toggleSidePanel.bind(this);
    return button;
  }

  toggleSidePanel() {
    this.overlay.toggle();
    this.sidePanel.classList.toggle('-translate-x-full');
  }
}
