import { CollapsableButton, CollapsableButtonProps } from "./button";
import { CollapsableSection, CollapsableSectionProps } from "./section";

type CollapsableSettings = {
  className?: string,
  button?: CollapsableButtonProps,
  collapsable?: CollapsableSectionProps
}

export class Collapsable {

  private static CSS_CLASSES = 'flex flex-col mb-5 transition-all duration-500';

  private container: HTMLElement;
  private section: CollapsableSection;
  private button: CollapsableButton;

  private isOpen: boolean;
  private isActive: boolean;

  private idPrefix: string;

  constructor(id:string, title: string, settings: CollapsableSettings = {}) {
    this.idPrefix = `collapsable-${id}`;
    this.container = document.createElement('div');
    this.container.id = this.idPrefix;
    this.container.className = `collapsable ${Collapsable.CSS_CLASSES} ${settings?.className ?? ''}`;

    this.button = new CollapsableButton(this.idPrefix, title, settings?.button);
    this.button.setClickHandler(() => this.toggle());
    this.container.appendChild(this.button.element);
    
    this.section = new CollapsableSection(this.idPrefix, settings?.collapsable);
    this.container.appendChild(this.section.element);

    this.isOpen = false;
    this.isActive = true;
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  addContent(content: HTMLElement) {
    this.button.showIcon();
    this.section.addContent(content);
  }

  updateTitle(title: string) {
    this.button.updateTitle(title);
  }

  replaceContent(content: HTMLElement[]) {
    if (this.isOpen) {
      this.toggle();
    }

    this.isActive = content !== undefined && content.length > 0;

    this.button.disable(!this.isActive);

    if (this.isActive) {
      this.button.showIcon();
      this.section.replaceContent(content);
    } else {
      this.button.hideIcon();
      this.section.clearContent();
    }
  }

  toggle() {
    this.button.disable(true);
    if (this.isActive && this.isOpen) {
      this.close();
    } else if(this.isActive) {
      this.open();
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.section.close(() => {
        this.button.disable(false);
      });
      this.button.setClosedState();
    }
  }

  open() {
    this.isOpen = true;
    this.section.open(() => {
      this.button.disable(false);
    });
    this.button.setOpenState();
  }
}