import { Timer } from 'three/addons/misc/Timer.js';
import { ExerciseClass } from '@/app/journey/types';
import RenderView from '@/app/layout/render-view';
import DebugUI from '@/app/layout/debug-ui';
import GUI, { Controller } from 'lil-gui';
import { Quality } from '@/app/layout/quality-selector';

type DebuggableExercise =  ExerciseClass & {
  isDebuggable: boolean;
  shouldDebug: boolean;
  toggleDebug: () => void;
}

type CustomizableController = {
  propertyPath: string;
  isColor?: boolean;
  configuration?: {
    min?: number;
    max?: number;
    step?: number;
    name?: string;
    onChange?: string;
    onFinishChange?: string;
  };
}

export function Debuggable(constructor: ExerciseClass ): any {
  return class extends constructor {
    public isDebuggable: boolean = true;
    public isCustomizable: boolean = constructor.isCustomizable ?? false;

    public shouldDebug = false;

    constructor(view: RenderView, quality: Quality, debugUi: DebugUI) {
      super(view, quality);
      this.descriptions.push('<strong>Toggle Debug:</strong> Double click/tap');
      if(constructor.isCustomizable) {
        (this as any).buildGui(debugUi.gui);  
      }
    }

    toggleDebug() {
      this.shouldDebug = !this.shouldDebug;
    }
  }
}

export function DebugFPS(_: any, _1: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(timer: Timer) {
    originalMethod.call(this, timer);

    if((this as DebuggableExercise).shouldDebug) {
      const fps = 1/timer.getDelta();
      (this as EventTarget).dispatchEvent(new CustomEvent('debug-info', { detail: { fps } }));
    }
  };

  return descriptor;
}

export function Customizable(folderPath: string, controllers: CustomizableController[]) {
  return function(target: any, property: string) {
    target.constructor.isCustomizable = true;
    const originalBuildMethod = target.buildGui ?? function() {};

    target.buildGui = function(gui: GUI) {
      originalBuildMethod.call(this, gui);
      const folder = findFolder(gui, folderPath);

      controllers.forEach((controller) => {
        const [customizableObject, customizableProperty] = findeCustomizableObject(this, property, controller.propertyPath);
        let guiController = createGUIController(folder, customizableObject, customizableProperty, controller.isColor);

        if(controller.configuration) {
          Object.entries(controller.configuration).forEach(([key, value]) => {
            if(key === 'onChange' || key === 'onFinishChange') {
              guiController[key](this[value].bind(this))
            } else {
              guiController[key as keyof Controller](value);
            }
          });
        }
      });
    }
  }
}

export function Callable(folderPath: string, name: string) {
  return function(target: any, property: string, descriptor: PropertyDescriptor) {
    const originalBuildMethod = target.buildGui ?? function() {};
    target.buildGui = function(gui: GUI) {
      originalBuildMethod.call(this, gui);
      const folder = findFolder(gui, folderPath);
      descriptor.value.bind(this);
      folder.add(this, property).name(name);
    }
  }
}

function createGUIController(folder: GUI, customizableObject: any, customizableProperty: string, isColor: boolean = false): Controller {
  const addMethod = isColor ? 'addColor' : 'add';
  return folder[addMethod](customizableObject, customizableProperty);
}

function findeCustomizableObject(object: any, property: string, propertyPath: string): [any, string] {
  console.log(object, property, propertyPath);
  
  let customizableObject = typeof object[property] === 'object' ? object[property] : object;
  console.log(customizableObject);

  const propertyPathParts = propertyPath.split('.');
  console.log(propertyPathParts);

  const customizableProperty = propertyPathParts.pop();
  console.log(customizableProperty);

  if(!customizableProperty) {
    throw new Error(`Invalid property path: ${propertyPath} for object: ${object}`);
  }
  
  customizableObject =  propertyPathParts.reduce((obj: any, prop: string) => {
    return obj[prop];
  }, customizableObject);

  return [customizableObject, customizableProperty];
}

function findFolder(gui: GUI, folderPath: string): GUI {
  return folderPath.split('/').reduce((folder: GUI, folderName: string) => {
    const existingFolder = folder.folders.find(f => f._title === folderName);
    if(existingFolder) {
      return existingFolder;
    } else {
      return folder.addFolder(folderName);
    }
  }, gui);
}