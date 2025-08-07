import { CSS_CLASSES } from "#/theme";

export type CollapsableSectionProps = {
  className?: string;
}

export class CollapsableSection {
  
  private static CSS_CLASSES = `overflow-hidden transition-all duration-500 hidden h-0 ${CSS_CLASSES.background} ${CSS_CLASSES.text}`;

  public element: HTMLElement;
  private isOpen: boolean;

  constructor(id: string, settings: CollapsableSectionProps = {}) {
    this.element = this.createElement(id, settings);
    this.isOpen = false;
  }

  addContent(content: HTMLElement) {
    this.element.appendChild(content);
  }

  replaceContent(content: HTMLElement[]) {
    this.element.innerHTML = '';
    
    for (const element of content) {
      this.element.appendChild(element);
    }
  }

  clearContent() {
    this.element.innerHTML = '';
  }

  open(onComplete?: () => void) {
    if (!this.isOpen) {
      this.isOpen = true;
      this.element.classList.remove('hidden');
      
      const height = this.element.scrollHeight;
      this.element.style.height = `${height}px`;

      if (onComplete) {
        this.element.addEventListener('transitionend', onComplete, { once: true });
      }
    }
  }

  close(onComplete?: () => void) {
    if (this.isOpen) {
      this.isOpen = false;
      this.element.style.height = '0';
      
      const handleTransitionEnd = () => {
        this.element.classList.add('hidden');
        if (onComplete) {
          onComplete();
        }
      };

      this.element.addEventListener('transitionend', handleTransitionEnd, { once: true });
    }
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  getScrollHeight(): number {
    return this.element.scrollHeight;
  }

  private createElement(id: string, settings: CollapsableSectionProps) {
    const section = document.createElement('div');
    section.id = `${id}-content-container`;
    section.className = `${CollapsableSection.CSS_CLASSES} ${settings?.className ?? ''} hidden`;
    return section;
  }
}
