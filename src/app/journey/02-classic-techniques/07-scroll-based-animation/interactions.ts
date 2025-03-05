import { Position2D } from "#/app/types/exercise";

function isMobile() {
  return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
}

function  hasOrientationSupport() {
  return 'DeviceOrientationEvent' in window && isMobile();
}

function hasMotionSupport() {
  return 'DeviceMotionEvent' in window && isMobile();
}

export class Interactions extends EventTarget {

  private element: HTMLElement;

  private _yScroll: number;
  private mousePosition: Position2D;
  private _section: number;
  
  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this._yScroll = this.element.scrollTop;
    this.mousePosition = { x: 0, y: 0 };
    this._section = 0;

    this.element.addEventListener('scroll', this.scrollHandler.bind(this));
    if(hasOrientationSupport()) {
      window.addEventListener('deviceorientation', this.orientationHandler.bind(this));
    } else if(hasMotionSupport()) {
      window.addEventListener('devicemotion', this.motionHandler.bind(this));
    } else {
      this.element.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    }    
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

  rotationToPosition(gamma: number, beta: number) {
    const x = gamma || 0;
    const y = beta || 0;
    this.mousePosition = { x: x / 30, y: y / 30 };
  }

  orientationHandler(evt: DeviceOrientationEvent) {
    if(evt.gamma !== null && evt.beta !== null) {
      this.rotationToPosition(evt.gamma, evt.beta);
    }
  }

  motionHandler(evt: DeviceMotionEvent) {
    const rotationRate = evt.rotationRate;
    if(rotationRate !== null && rotationRate.beta !== null && rotationRate.gamma !== null) {
      this.rotationToPosition(rotationRate.gamma, rotationRate.beta);
    }
  }

  dispose() {
    this.element.removeEventListener('scroll', this.scrollHandler.bind(this));

    if(hasOrientationSupport()) {
      window.removeEventListener('deviceorientation', this.orientationHandler.bind(this));
    } else if(hasMotionSupport()) {
      window.removeEventListener('devicemotion', this.motionHandler.bind(this));
    } else {
      this.element.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
    }
  }
}