import { Vector2, Vector3 } from "three";

import { CSS_CLASSES } from "#/theme";

export class HelpPoint {
  private label: HTMLElement;
  private text: HTMLElement;

  public screenPosition: Vector2;
  public readonly position: Vector3;

  public element: HTMLElement;

  private isVisible: boolean = true;

  constructor(label: string, text: string, position: Vector3) {
    this.label = this.createLabel(label);

    this.text = this.createText(text);

    this.element = this.createContainer();
    this.element.appendChild(this.label);
    this.element.appendChild(this.text);

    this.addListeners();

    this.position = position;
    this.screenPosition = new Vector2();
  }

  public update() {
    const translateX = this.screenPosition.x * window.innerWidth * 0.5;
    const translateY = - this.screenPosition.y * window.innerHeight * 0.5;

    this.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
  }
  
  private createLabel(label: string) {
    const labelElement = document.createElement('span');
    labelElement.id = `point-${label}-label`;
    labelElement.className = `absolute top-[-20px] left-[-20px] w-[40px] h-[40px] rounded-full bg-black/50 border-1 border-white/50 text-white flex items-center justify-center leading-[40px] font-thin cursor-help transition-all duration-150 ease-in-out`;
    labelElement.innerHTML = label;
    return labelElement;
  }

  private createText(text: string) {
    const textElement = document.createElement('span');
    textElement.id = `point-${text}-text`;
    textElement.className = `absolute top-[30px] left-[-100px] w-[200px] p-[20px] border-1 rounded-[4px] bg-black/50 border-white/50 text-white leading-[1.3em] opacity-0 transition-all duration-150`;
    textElement.innerHTML = text;
    return textElement;
  }

  private createContainer() {
    const container = document.createElement('div');
    container.className = `absolute top-[50%] left-[50%] ${CSS_CLASSES.exercise_index}`;
    container.id = `point-${this.label}`;
    return container;
  }

  private addListeners() {
    this.label.addEventListener('mouseenter', () => {
      this.text.classList.toggle('opacity-0');
    });
    this.label.addEventListener('mouseleave', () => {
      this.text.classList.toggle('opacity-0');
    });   
  }

  public hide() {
    if(this.isVisible) {
      this.label.classList.add('opacity-0', 'scale-0');
      this.isVisible = false;
    }
  }

  public show() {
    if(!this.isVisible) {
      this.label.classList.remove('opacity-0', 'scale-0');
      this.isVisible = true;
    }
  }
}