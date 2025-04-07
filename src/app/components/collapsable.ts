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
    toggle: string[];
  };

  private isOpen: boolean;
  private isActive: boolean;

  constructor(title: string, settings: CollapsableSettings = {}) {
    this.container = document.createElement('div');
    this.container.className = `${Collapsable.CSS.container} ${settings?.className ?? ''}`;

    this.button = this.createButton(title, settings?.button);

    this.collapsable = this.createCollapsable(settings?.collapsable);

    this.isOpen = false;
    this.isActive = true;
  }

  private createCollapsable(settings: CollapsableSectionSettings | undefined) {
    const collapsable = document.createElement('div');
    const className = `${Collapsable.CSS.collapsable} ${settings?.className ?? ''}`;
    collapsable.className = `${className}`;
    this.container.appendChild(collapsable);
    return collapsable;
  }

  private createButton(title: string, settings: CollapsableButtonSettings | undefined) {
    const icon = this.getButtonIcon(settings);

    const button = document.createElement('button');

    const className = settings?.className ?? `flex items-center justify-between font-medium`;
    button.className = `${CSS_CLASSES.background} ${CSS_CLASSES.text} ${className} transition-all duration-500`;

    button.innerHTML = `<span class='collapsable-title'>${title}</span>`;
    button.appendChild(icon);
    button.addEventListener('click', () => this.toggle());
    this.container.appendChild(button);

    return {
      element: button,
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

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  addContent(content: HTMLElement) {
    this.button.icon.classList.remove('hidden');
    this.collapsable.appendChild(content);
  }

  updateTitle(title: string) {
    const titleElement = this.button.element.querySelector('.collapsable-title');
    if (titleElement === null) {
      throw new Error('Title element for collapsable not found');
    }
    titleElement.textContent = title
  }

  replaceContent(content: HTMLElement[]) {
    this.collapsable.innerHTML = '';

    if (this.isOpen) this.toggle();

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
    if (this.isActive && this.isOpen) {
      this.close();
    } else if(this.isActive) {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.collapsable.classList.remove('hidden');
    this.collapsable.style.height = `${this.collapsable.scrollHeight}px`;

    for (const className of this.button.toggle) {
      this.button.element.classList.add(className);
    }
    this.button.icon.classList.add('rotate-[270deg]');
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.collapsable.style.height = '0';
      this.collapsable.addEventListener('transitionend', () => {
        this.collapsable.classList.add('hidden');
      }, { once: true });

      for (const className of this.button.toggle) {
        this.button.element.classList.remove(className);
      }
      this.button.icon.classList.remove('rotate-[270deg]');
    }
  }
}