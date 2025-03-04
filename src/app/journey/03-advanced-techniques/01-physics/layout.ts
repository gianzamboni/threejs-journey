import { CSS_CLASSES } from "#/theme";
import BOX from "./icons/cube.svg?raw";
import SPHERE from "./icons/sphere.svg?raw";
import TRASH from "./icons/trash.svg?raw";

export class PhysicsLayout {

  private layoutContainer: HTMLElement;

  public readonly sphereButton: HTMLButtonElement;  
  public readonly boxButton: HTMLButtonElement;
  public readonly removeButton: HTMLButtonElement;

  constructor() {
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.className = `flex mx-5 mb-5 justify-around`;

    const buttonClasses = `cursor-pointer py-2 px-3 items-center border h-20 w-20 font-medium rounded-md shadow-xs ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text} ${CSS_CLASSES.hover} ${CSS_CLASSES.main_layout_index}`
    
    this.sphereButton = document.createElement('button');
    this.sphereButton.className = buttonClasses;
    console.log(SPHERE);
    this.sphereButton.setAttribute('title', 'Add Sphere');
    this.sphereButton.innerHTML = SPHERE;
    this.layoutContainer.appendChild(this.sphereButton);

    this.boxButton = document.createElement('button');
    this.boxButton.innerHTML = BOX;
    this.boxButton.className = buttonClasses;
    this.boxButton.setAttribute('title', 'Add Box');
    this.layoutContainer.appendChild(this.boxButton);

    this.removeButton = document.createElement('button');
    this.removeButton.innerHTML = TRASH;
    this.removeButton.className = buttonClasses;
    this.removeButton.setAttribute('title', 'Remove All');
    this.layoutContainer.appendChild(this.removeButton);

    const infoBoxContainer = document.getElementById('info-box-container');
    infoBoxContainer?.insertBefore(this.layoutContainer, infoBoxContainer.firstChild);
  }

  remove() {
    this.layoutContainer.remove();
  }

  get element() {
    return this.layoutContainer;
  }

  get length() {
    return this.layoutContainer.children.length;
  }
}