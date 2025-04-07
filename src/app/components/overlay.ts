import { CSS_CLASSES } from "#/theme";

export class Overlay {

  private element: HTMLElement;


  public addEventListener: typeof HTMLElement.prototype.addEventListener;
  
  public constructor() {
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'overlay');
    this.element.className = `fixed top-0 start-0 bottom-0 end-0 ${CSS_CLASSES.overlay_index} bg-black/50 hidden`;
    document.body.appendChild(this.element);

    this.addEventListener = this.element.addEventListener.bind(this.element);
  }

  hide() {
    this.element.classList.add('hidden');
  }

  show() {
    this.element.classList.remove('hidden');
  }

  toggle() {
    this.element.classList.toggle('hidden');
  }

  get opened() {
    return !this.element.classList.contains('hidden');
  }

}