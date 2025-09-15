import { DOWN_ARROW } from "#/app/constants/icons";
import { CSS_CLASSES } from "#/theme";

export type CollapsableButtonProps = {
  className?: string;
  iconSize?: number;
  toggle?: string[];
}

export class CollapsableButton {
  
  public element: HTMLButtonElement;
  public icon: HTMLElement;
  public title: HTMLElement;
  public toggle: string[];

  constructor(id: string, title: string, settings: CollapsableButtonProps = {}) {
    this.toggle = settings?.toggle ?? [];
    
    this.icon = this.createIcon(settings);
    this.element = this.createButton(id, settings);
    this.title = this.createTitle(id, title);
    
    this.element.appendChild(this.title);
    this.element.appendChild(this.icon);
  }

  updateTitle(title: string) {
    this.title.textContent = title;
  }

  setClickHandler(handler: () => void) {
    this.element.addEventListener('click', handler);
  }

  disable(disabled: boolean) {
    this.element.disabled = disabled;
  }

  showIcon() {
    this.icon.classList.remove('hidden');
  }

  hideIcon() {
    this.icon.classList.add('hidden');
  }

  setOpenState() {
    for (const className of this.toggle) {
      this.element.classList.add(className);
    }
    this.icon.classList.add('rotate-[270deg]');
  }

  setClosedState() {
    for (const className of this.toggle) {
      this.element.classList.remove(className);
    }
    this.icon.classList.remove('rotate-[270deg]');
  }

  private createButton(id: string, settings: CollapsableButtonProps) {
    const button = document.createElement('button');
    button.id = `${id}-toggle-button`;
    const className = settings?.className ?? `flex items-center justify-between font-medium`;
    button.className = `${CSS_CLASSES.background} ${CSS_CLASSES.text} ${className} transition-all duration-500`;
    return button;
  }

  private createTitle(id: string, title: string) {
    const titleElement = document.createElement('span');
    titleElement.id = `${id}-title`;
    titleElement.textContent = title;
    return titleElement;
  }

  private createIcon(settings: CollapsableButtonProps) {
    const parser = new DOMParser();
    const arrow = parser.parseFromString(DOWN_ARROW, 'image/svg+xml').documentElement;
    arrow.setAttribute('width', `${settings?.iconSize ?? 24}px`);
    arrow.setAttribute('height', `${settings?.iconSize ?? 24}px`);
    arrow.classList.add('hidden');
    return arrow;
  }
}
