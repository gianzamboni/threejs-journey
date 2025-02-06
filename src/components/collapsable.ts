import { DOWN_ARROW } from "@/constants/icons";
import { CSS_CLASSES } from "@/theme";

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
    this.container.className = `flex flex-col mb-5 transition-all duration-500 ${settings?.className ?? ''}`;
    this.button = this.createButton(title, settings?.button);
    this.collapsable = this.createCollapsable(settings?.collapsable);
    this.isOpen = false;
    this.isActive = true;
  }

  private createCollapsable(settings: CollapsableSectionSettings | undefined) {
    const collapsable = document.createElement('div');
    const className = `overflow-hidden transition-all duration-500 hidden h-0 ${CSS_CLASSES.background} ${settings?.className ?? ''}`;
    collapsable.className = `${className}`;
    this.container.appendChild(collapsable);
    return collapsable;
  }

  private createButton(title: string, settings: CollapsableButtonSettings | undefined) {
    const parser = new DOMParser();
    const arrow = parser.parseFromString(DOWN_ARROW, 'image/svg+xml').documentElement;
    arrow.setAttribute('width', `${settings?.iconSize ?? 24}px`);
    arrow.setAttribute('height', `${settings?.iconSize ?? 24}px`);
    arrow.classList.add('hidden')
    const button = document.createElement('button');
    const className = settings?.className ?? `flex items-center justify-between font-medium`;
    button.className = `${CSS_CLASSES.background} ${CSS_CLASSES.text} ${className} transition-all duration-500`;
    button.innerHTML = `
      <span class='collapsable-title'>${title}</span>
    `;
    button.appendChild(arrow);
    button.addEventListener('click', () => this.toggle());
    this.container.appendChild(button);
    
    return {
      element: button,
      icon: arrow,
      toggle: settings?.toggle ?? [],
    };
  }

  addTo(parent: HTMLElement) {
    this.button.icon.classList.remove('hidden');
    parent.appendChild(this.container);
  }

  addContent(content: HTMLElement) {
    this.collapsable.appendChild(content);
  }

  updateTitle(title: string) {
    this.button.element.querySelector('.collapsable-title')!.textContent = title
  }

  replaceContent(content: string[] | undefined) {
    this.collapsable.innerHTML = '';
    this.isActive = content !== undefined && content.length > 0;
    this.button.element.disabled = !this.isActive;
    if(this.isActive) {
      this.button.icon.classList.remove('hidden');
      content!.forEach((element) => {
        const container = document.createElement('div');
        container.className = 'px-5 py-2';
        container.innerHTML = element;
        this.collapsable.appendChild(container);
      });
    } else {
      this.button.icon.classList.add('hidden');
    }
  }

  toggle() {
    if(this.isActive) {
      this.isOpen = !this.isOpen;
      if(this.isOpen) {
        this.collapsable.classList.remove('hidden');
        this.collapsable.style.height = `${this.collapsable.scrollHeight}px`;
        setTimeout(() => {
          this.collapsable.style.height = 'auto';
        }, 500);
      } else {
        this.collapsable.style.height = `${this.collapsable.scrollHeight}px`;
        setTimeout(() => {
          this.collapsable.style.height = '0';
          this.collapsable.addEventListener('transitionend', () => {
            this.collapsable.classList.add('hidden');
          }, { once: true });
        }, 0);
      }
      this.button.toggle.forEach((className) => {
        this.button.element.classList.toggle(className);
      });
      this.button.icon.classList.toggle('rotate-[270deg]');
    }
  }
   
}