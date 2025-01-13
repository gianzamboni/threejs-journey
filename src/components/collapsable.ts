import { DOWN_ARROW } from "@/constants/icons";
import { THEME } from "@/theme";

export class Collapsable {

  private container: HTMLElement;
  private collapsable: HTMLElement;
  private buttonIcon: HTMLElement;

  private isOpen: boolean = false;

  constructor(title: string) {
    this.container = document.createElement('div');
    this.container.className = 'flex flex-col mb-5';
    this.buttonIcon = this.createButton(title);
    this.collapsable = this.createCollapsable();
    this.isOpen = false;
  }

  private createCollapsable() {
    const collapsable = document.createElement('div');
    collapsable.className = 'overflow-hidden transition-all duration-500 hidden h-0';
    this.container.appendChild(collapsable);
    return collapsable;
  }

  private createButton(title: string) {
    const parser = new DOMParser();
    const arrow = parser.parseFromString(DOWN_ARROW, 'image/svg+xml').documentElement;
    const button = document.createElement('button');
    button.className = `flex items-center justify-between font-medium ${THEME.background} ${THEME.text}`;
    button.innerHTML = `
      <span>${title}</span>
    `;
    button.appendChild(arrow);
    button.addEventListener('click', () => this.toggle());
    this.container.appendChild(button);
    return arrow;
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  addContent(content: HTMLElement) {
    this.collapsable.appendChild(content);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.collapsable.classList.remove('hidden');
      this.collapsable.style.height = `${this.collapsable.scrollHeight}px`;
    } else {
      this.collapsable.style.height = '0';
      setTimeout(() => {
        this.collapsable.classList.add('hidden');
      }, 500);
    }
    this.buttonIcon.classList.toggle('rotate-180');
  }
}