export class Overlay {

  private element: HTMLElement;

  private static instances: Record<string, Overlay> = {};

  public addEventListener: typeof HTMLElement.prototype.addEventListener;
  static getInstance(parent: HTMLElement) {
    if(parent.id === '')  {
      throw new Error('Parent element must have an id');
    }
    
    if(Overlay.instances[parent.id] === undefined) {
      Overlay.instances[parent.id] = new Overlay(parent);
    }
    
    return Overlay.instances[parent.id];
  }

  private constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'overlay');
    this.element.className = `fixed top-0 start-0 bottom-0 end-0 z-50 bg-black bg-opacity-50 hidden`;
    parent.appendChild(this.element);

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