import { DropDownMenu } from "#/app/components/drop-down-menu";
import { ButtonAction, Exercise, SelectableAction } from "#/app/types/exercise";
import { getActions } from "#/app/utils/exercise-metadata";
import { CSS_CLASSES } from "#/theme";

export class ActionBar {

  private layoutContainer: HTMLElement;
  private buttons: HTMLButtonElement[];

  private interactiveElements: {
    element: HTMLButtonElement | DropDownMenu;
    action: (...args: any[]) => void;
  }[];

  private static buttonClasses = `cursor-pointer py-2 px-3 items-center border font-medium rounded-md shadow-xs transition-all duration-300 ${CSS_CLASSES.background} ${CSS_CLASSES.border} ${CSS_CLASSES.text} ${CSS_CLASSES.hover} ${CSS_CLASSES.main_layout_index}`

  constructor() {
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.id = 'action-bar-container';
    this.layoutContainer.className = `grid grid-cols-4 gap-5 my-5 justify-around`;
    this.buttons = [];
    this.interactiveElements = [];
  }

  addSelectable(action: SelectableAction, target: Exercise) {
    const dropDownMenu = new DropDownMenu('action-bar-selectable-' + action.label, {
      label: action.label,
      options: action.options,
      classes: 'col-span-4',
    });

    const onChange = (event: CustomEvent) => {
      action.onChange.bind(target)(event.detail.value);
    }
    
    dropDownMenu.setValue(action.defaultValue);
    dropDownMenu.addEventListener('change', onChange as EventListener);
    
    dropDownMenu.addTo(this.layoutContainer);
    this.interactiveElements.push({
      element: dropDownMenu,
      action: onChange
    });
  }
  
  addButton(action: ButtonAction, target: Exercise) {
    const button = document.createElement('button');
    button.id = `action-bar-button-${action.label}`;
    button.innerHTML = action.icon;
    button.className = `${ActionBar.buttonClasses} ${action.customClasses}`;
    
    button.setAttribute('title', action.label);

    this.layoutContainer.appendChild(button);
    this.interactiveElements.push({
      element: button,
      action: action.onClick.bind(target)
    }); 
  
    button.addEventListener('click', action.onClick.bind(target));  
    this.buttons.push(button);
  }

  addTo(parent: HTMLElement) {
    parent.insertBefore(this.layoutContainer, parent.firstChild);
  }

  disable() {
    this.buttons.forEach(button => {
      button.disabled = true;
      button.style.opacity = '0.5';
    });
  }

  enable() {
    this.buttons.forEach(button => {
      button.disabled = false;
      button.style.opacity = '1';
    });
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