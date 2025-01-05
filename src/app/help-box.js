import { deviceIsTouchable } from "../utils/utils";

export class HelpBox {
  constructor() {
    this.content = document.getElementById('help-box-content');
    this.title = document.getElementById('help-box-title');

    this.collapsable = document.getElementById('help-box-collapsable');
    this.helpSections = {
      exercise: document.getElementById('help-box-exercise-help'),
      orbitControls: document.getElementById('help-box-orbit-controls-help'),
      debugUI: document.getElementById('help-box-debug-ui-help')
    }

    Object.keys(this.helpSections).forEach((key) => {
      this.helpSections[key].classList.add('hidden');
    });
    
    this.collapsable.classList.add('hidden');

    if(deviceIsTouchable()) {
      this.title.setAttribute('data-bs-toggle', 'collapse');
      this.title.setAttribute('data-bs-target', '#help-box-content');
      this.title.setAttribute('aria-expanded', 'false');
      this.title.setAttribute('aria-controls', 'help-box-content');

      this.content.classList.add('collapse');

      const clickActions = document.getElementsByClassName('click-action');
      Array.from(clickActions).forEach((element) => {
        element.innerHTML = 'tap';
      });
    }
  }

  show(exercise) {
    
    if(deviceIsTouchable() && (exercise.help || exercise.config.enableOrbitControls || exercise.config.debugable)) {
      this.title.classList.add('d-flex', 'justify-content-center', 'gap-3');
      this.title.innerHTML =  '';
      this.title.appendChild(document.createTextNode(exercise.title));           
      const icon = document.createElement('div');
      icon.classList.add('icon');
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>';
      this.title.appendChild(icon);
    } else {
      this.title.innerHTML = exercise.title;
    } 
    if(exercise.help) {
      this.helpSections.exercise.innerHTML = exercise.help;
      this.collapsable.classList.remove('hidden');
    } else {
      this.collapsable.classList.add('hidden');
    }

    if(exercise.config.enableOrbitControls) {
      this.helpSections.orbitControls.classList.remove('hidden');
      this.collapsable.classList.remove('hidden');
    } else {
      this.helpSections.orbitControls.classList.add('hidden');
    }

    if(exercise.config.debugable) {
      this.helpSections.debugUI.classList.remove('hidden');
      this.collapsable.classList.remove('hidden');
    } else {
      this.collapsable.debugUI.classList.add('hidden');
    }
  }
}