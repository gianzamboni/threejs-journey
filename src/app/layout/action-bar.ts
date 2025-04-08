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
  }

  addButton(action: Action, target: Exercise) {
    const button = document.createElement('button');
    button.innerHTML = action.icon;
    button.className = ActionBar.buttonClasses;
    button.setAttribute('title', action.label);
    this.layoutContainer.appendChild(button);
    this.buttons.push(button);
    button.addEventListener('click', action.onClick.bind(target));
    this.layoutContainer.appendChild(button);
  }

  addTo(parent: HTMLElement) {
    parent.insertBefore(this.layoutContainer, parent.firstChild);
  }

  reset() {
    this.buttons.forEach(button => button.remove());
  }

  updateContent(exercise: Exercise) {
    const actions = getActions(exercise);
    actions.forEach(action => {
      this.addButton(action, exercise);
    })
  }
}