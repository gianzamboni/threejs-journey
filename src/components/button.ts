import { THEME } from "@/theme";

type ButtonSettings = {
  onClick: () => void;
}

export class Button {

  private htmlElement: HTMLButtonElement;

  constructor(content: string, settings: ButtonSettings) {
      this.htmlElement = document.createElement('button');
      this.htmlElement.innerHTML = content;
      this.htmlElement.className = `flex py-2 px-3 m-5 items-center gap-x-2 border  font-medium  rounded-md shadow-sm ${THEME.text} ${THEME.background} ${THEME.border} ${THEME.hover}`;

      this.htmlElement.onclick = settings.onClick;
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.htmlElement);
  }
}