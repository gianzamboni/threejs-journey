import { CSS_CLASSES } from "#/theme";

import { DropDownMenu } from "../components/drop-down-menu";
import { ButtonAction, Exercise, SelectableAction } from "../types/exercise";
import { getActions } from "../utils/exercise-metadata";

export class ActionBar {

  private layoutContainer: HTMLElement;
  private interactiveElements: {
    element: HTMLButtonElement | DropDownMenu;
    action: (...args: any[]) => void;
  }[];

  private static buttonClasses = `cursor-pointer py-2 px-3 items-center border h-20 w-20 font-medium rounded-md shadow-xs ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text} ${CSS_CLASSES.hover} ${CSS_CLASSES.main_layout_index}`

  constructor() {
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.id = 'action-bar-container';
    this.layoutContainer.className = `flex mx-5 mb-5 justify-around`;
    this.interactiveElements = [];
  }

  addSelectable(action: SelectableAction, target: Exercise) {
    const dropDownMenu = new DropDownMenu('action-bar-selectable-' + action.label, {
      label: action.label,
      options: action.options,
      classes: 'w-full',
    });
    dropDownMenu.addEventListener('change', action.onChange.bind(target) as EventListener);
    dropDownMenu.addTo(this.layoutContainer);
    this.interactiveElements.push({
      element: dropDownMenu,
      action: action.onChange.bind(target)
    });
  }
  
  addButton(action: ButtonAction, target: Exercise) {
    const button = document.createElement('button');
    button.id = `action-bar-button-${action.label}`;
    button.innerHTML = action.icon;
    button.className = ActionBar.buttonClasses;
    button.setAttribute('title', action.label);

    this.layoutContainer.appendChild(button);
    this.interactiveElements.push({
      element: button,
      action: action.onClick.bind(target)
    });
  
    button.addEventListener('click', action.onClick.bind(target));  
  }

  addTo(parent: HTMLElement) {
    parent.insertBefore(this.layoutContainer, parent.firstChild);
  }

  reset() {
    this.interactiveElements.forEach(element => {
      if(element.element instanceof HTMLButtonElement) {
        element.element.removeEventListener('click', element.action);
      } else if(element.element instanceof DropDownMenu) {
        element.element.removeEventListener('change', element.action);
      }
      element.element.remove();
    });
  }

  updateContent(exercise: Exercise) {
    const actions = getActions(exercise);
    actions.forEach(action => {
      if(action.type === 'button') {
        this.addButton(action as ButtonAction, exercise);
      } else if(action.type === 'selectable') {
        this.addSelectable(action as SelectableAction, exercise);
      }
    })
  }
}