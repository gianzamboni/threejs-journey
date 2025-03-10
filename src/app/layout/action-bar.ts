import { CSS_CLASSES } from "#/theme";

import { Action, Exercise } from "../types/exercise";
import { getActions } from "../utils/exercise-metadata";

export class ActionBar {

  private layoutContainer: HTMLElement;
  private buttons: HTMLButtonElement[];

  private static buttonClasses = `cursor-pointer py-2 px-3 items-center border h-20 w-20 font-medium rounded-md shadow-xs ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text} ${CSS_CLASSES.hover} ${CSS_CLASSES.main_layout_index}`
  
  constructor() {
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.className = `flex mx-5 mb-5 justify-around`;
    this.buttons = [];

    const infoBoxContainer = document.getElementById('info-box-container');
    if(!infoBoxContainer) {
      throw new Error('Info box container not found');
    }
    infoBoxContainer.insertBefore(this.layoutContainer, infoBoxContainer.firstChild);
    
  }

  addButton(action: Action, target: Exercise) {
    const button = document.createElement('button');
    button.innerHTML = action.icon;
    button.className = ActionBar.buttonClasses;
    button.setAttribute('title', action.label);
    this.layoutContainer.appendChild(button);
    this.buttons.push(button);
    button.addEventListener('click', action.onClick.bind(target));
    console.log(button);    
    this.layoutContainer.appendChild(button);
  }

  reset() {
    this.buttons.forEach(button => button.remove());
  }

  updateContent(exercise: Exercise) {
    const actions = getActions(exercise);
    console.log(actions);
    actions.forEach(action => {
      this.addButton(action, exercise);
    })
  }
}