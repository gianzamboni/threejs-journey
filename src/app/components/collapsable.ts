import { DOWN_ARROW } from "#/app/constants/icons";
import { CSS_CLASSES } from "#/theme";

type CollapsableButtonSettings = {
  className?: string;
  iconSize?: number;
  toggle?: string[];
}

type CollapsableSectionSettings = {
  className?: string;
}

type CollapsableSettings = {
  className?: string,
  button?: CollapsableButtonSettings,
  collapsable?: CollapsableSectionSettings
}

export class Collapsable {

  private static CSS = {
    container: 'flex flex-col mb-5 transition-all duration-500',
    collapsable: `overflow-hidden transition-all duration-500 hidden h-0 ${CSS_CLASSES.background} ${CSS_CLASSES.text}`,
  };

  private container: HTMLElement;
  private collapsable: HTMLElement;

  private button: {
    element: HTMLButtonElement;
    icon: HTMLElement;
    title: HTMLElement;
    toggle: string[];
  };

  private isOpen: boolean;
  private isActive: boolean;

  private idPrefix: string;

  constructor(id:string, title: string, settings: CollapsableSettings = {}) {
    this.idPrefix = `collapsable-${id}`;
    this.container = document.createElement('div');
    this.container.id = this.idPrefix;
    this.container.className = `collapsable ${Collapsable.CSS.container} ${settings?.className ?? ''}`;

    this.button = this.createButton(title, settings?.button);
    
    this.collapsable = this.createCollapsable(settings?.collapsable);

    this.isOpen = false;
    this.isActive = true;
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  addContent(content: HTMLElement) {
    this.button.icon.classList.remove('hidden');
    this.collapsable.appendChild(content);
  }

  updateTitle(title: string) {
    this.button.title.textContent = title;
  }

  replaceContent(content: HTMLElement[]) {
    this.collapsable.innerHTML = '';

    if (this.isOpen) {
      this.toggle();
    }

    this.isActive = content !== undefined && content.length > 0;

    this.button.element.disabled = !this.isActive;

    if (this.isActive) {
      this.button.icon.classList.remove('hidden');
      for (const element of content) {
        this.collapsable.appendChild(element);
      }
    } else {
      this.button.icon.classList.add('hidden');
    }
  }

  toggle() {
    this.button.element.disabled = true;
    if (this.isActive && this.isOpen) {
      this.close();
    } else if(this.isActive) {
      this.open();
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.collapsable.style.height = '0';
      this.collapsable.addEventListener('transitionend', () => {
        this.collapsable.classList.add('hidden');
        this.button.element.disabled = false;
      }, { once: true });

      for (const className of this.button.toggle) {
        this.button.element.classList.remove(className);
      }
      this.button.icon.classList.remove('rotate-[270deg]');
    }
  }

  public open() {
    this.isOpen = true;
    this.collapsable.classList.remove('hidden');
    
    const height = this.collapsable.scrollHeight;
    this.collapsable.style.height = `${height}px`;

    for (const className of this.button.toggle) {
      this.button.element.classList.add(className);
    }
    this.button.icon.classList.add('rotate-[270deg]');
    this.collapsable.addEventListener('transitionend', () => {
      this.button.element.disabled = false;
    }, { once: true });
  }
  
  private createCollapsable(settings: CollapsableSectionSettings | undefined) {
    const collapsable = document.createElement('div');
    collapsable.id = `${this.idPrefix}-content-container`;
    const className = `${Collapsable.CSS.collapsable} ${settings?.className ?? ''} hidden`;
    collapsable.className = `${className}`;
    this.container.appendChild(collapsable);
    return collapsable;
  }

  private createButton(title: string, settings: CollapsableButtonSettings | undefined) {
    const icon = this.getButtonIcon(settings);

    const button = document.createElement('button');
    button.id = `${this.idPrefix}-toggle-button`;
    const className = settings?.className ?? `flex items-center justify-between font-medium`;
    button.className = `${CSS_CLASSES.background} ${CSS_CLASSES.text} ${className} transition-all duration-500`;

    const titleElement = document.createElement('span');
    titleElement.id = `${this.idPrefix}-title`;

    titleElement.textContent = title;

    button.appendChild(titleElement);
    button.appendChild(icon);
    button.addEventListener('click', () => this.toggle());
    this.container.appendChild(button);

    return {
      element: button,
      title: titleElement,
      icon,
      toggle: settings?.toggle ?? [],
    };
  }

  private getButtonIcon(settings: CollapsableButtonSettings | undefined) {
    const parser = new DOMParser();
    const arrow = parser.parseFromString(DOWN_ARROW, 'image/svg+xml').documentElement;
    arrow.setAttribute('width', `${settings?.iconSize ?? 24}px`);
    arrow.setAttribute('height', `${settings?.iconSize ?? 24}px`);
    arrow.classList.add('hidden')
    return arrow;
  }
}