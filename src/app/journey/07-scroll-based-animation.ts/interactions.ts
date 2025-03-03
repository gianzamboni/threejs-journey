export class Interactions extends EventTarget {

  private element: HTMLElement;

  private _yScroll: number;
  private mousePosition: { x: number, y: number };
  private _section: number;

  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this._yScroll = this.element.scrollTop;
    this.mousePosition = { x: 0, y: 0 };
    this._section = 0;

    this.element.addEventListener('scroll', this.scrollHandler.bind(this));
    this.element.addEventListener('mousemove', this.mouseMoveHandler.bind(this));

  }

  get yScroll() {
    return this._yScroll;
  }

  get section() {
    return this._section;
  }

  get cursor() {
    return this.mousePosition;
  }

  scrollHandler() {
    this._yScroll = this.element.scrollTop;

    const newSection = Math.round(this._yScroll / this.element.clientHeight);
    if(newSection !== this._section) {
      this._section = newSection;
      this.dispatchEvent(new CustomEvent('sectionChange', { detail: { section: this._section } }));
    }
  }

  mouseMoveHandler(evt: MouseEvent) {
    const x = evt.clientX;
    const y = evt.clientY;
    this.mousePosition = { x: x / this.element.clientWidth - 0.5, y: y / this.element.clientHeight - 0.5 };
  }

  dispose() {
    this.element.removeEventListener('scroll', this.scrollHandler.bind(this));
    this.element.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
  }
}