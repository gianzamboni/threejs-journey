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
  initialValue?: any;
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
  if(typeof originalMethod !== 'function') {
    throw new Error('DebugFPS decorator can only be applied to methods');
  }

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
        const [customizableObject, customizableProperty] = findeCustomizableObject(this, property, controller);
        let guiController = createGUIController(folder, customizableObject, customizableProperty, controller.isColor);
        applyConfiguration(this, guiController, controller.configuration);
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

function applyConfiguration(instance: any, guiController: Controller, configuration: CustomizableController['configuration']) {
  if(!configuration) {
    return;
  }
  Object.entries(configuration).forEach(([key, value]) => {
    if(key === 'onChange' || key === 'onFinishChange') {
      guiController[key](instance[value as keyof Controller].bind(instance))
    } else {
      guiController[key as keyof Controller](value);
    }
  });
}

function createGUIController(folder: GUI, customizableObject: any, customizableProperty: string, isColor: boolean = false): Controller {
  const addMethod = isColor ? 'addColor' : 'add';
  return folder[addMethod](customizableObject, customizableProperty);
}

function findeCustomizableObject(instance: any, property: string, controller: CustomizableController): [any, string] {
  const needsDebugObject = controller.configuration !== undefined 
    && ['onChange', 'onFinishChange'].some((event) => event in controller.configuration!);

  const propertyPathParts = controller.propertyPath.split('.');
  propertyPathParts.unshift(property);

  const customizableProperty = propertyPathParts.pop();
  if(!customizableProperty) {
    throw new Error(`Invalid property path: ${controller.propertyPath}.${customizableProperty}`);
  }

  let customizableObject;
  if(needsDebugObject) {
    customizableObject = createDebugObjectPath(instance, propertyPathParts, customizableProperty, controller);
  } else {
    customizableObject = getObjectPath(instance, propertyPathParts, customizableProperty);
  }

  return [customizableObject, customizableProperty];
}

function getObjectPath(instance: any, propertyPath: string[], propertyName: string): any {
  const object = propertyPath.reduce((obj: any, prop: string) => {
    if(obj[prop] === undefined) {
      throw new Error(`Invalid property path: ${propertyPath}.${propertyName}`);
    }
    return obj[prop];
  }, instance);

  if(object[propertyName] === undefined) {
    throw new Error(`Invalid property path: ${propertyPath}.${propertyName}`);
  }

  return object
}

function createDebugObjectPath(instance: any, propertyPath: string[], propertyName: string, controller: CustomizableController): any {
  const debugObject = getDebugObject(instance);
  const pathObject = propertyPath.reduce(([debugObj, originalObj]: any[], prop: string) => {
    if(debugObj[prop] === undefined) {
      debugObj[prop] = {};
    }
    return [debugObj[prop], originalObj[prop]];
  }, [debugObject, instance]);

  if(pathObject[0][propertyName] !== undefined) {
    throw new Error(`Property already exists: ${propertyPath.join('.')}.${propertyName}`);
  }

  if(pathObject[1][propertyName] === undefined && controller.initialValue === undefined) {
    throw new Error(`Property does not exist: ${propertyPath.join('.')}.${propertyName}. Provide an initialValue for the controller`);
  }

  pathObject[0][propertyName] = pathObject[1][propertyName] ?? controller.initialValue;
  return pathObject[0]

}

function getDebugObject(instance: any): any {
  if(!instance.debugObject) {
    instance.debugObject = {};
  }

  return instance.debugObject;
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