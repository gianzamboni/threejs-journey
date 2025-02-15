import { Timer } from 'three/addons/misc/Timer.js';
import { ExerciseClass } from '@/app/journey/types';
import RenderView from '@/app/layout/render-view';
import DebugUI from '@/app/layout/debug-ui';
import { Quality } from '@/app/layout/quality-selector';
import { CustomizableController, CustomizablePropertiesManager } from './customizable';

type DebuggableExercise =  ExerciseClass & {
  isDebuggable: boolean;
  shouldDebug: boolean;
  customizableProperties: CustomizablePropertiesManager;
  toggleDebug: () => void;
}


export function Debuggable(constructor: ExerciseClass ): any {
  return class extends constructor {
    public isDebuggable: boolean = true;

    public static customizableProperties: CustomizablePropertiesManager | undefined;
    public shouldDebug = false;
    
    constructor(view: RenderView, quality: Quality, debugUi: DebugUI) {
      super(view, quality);
      const propertiesManager = getCustomizablePropertiesManager(constructor);
      propertiesManager.init(this, debugUi);
      this.descriptions.push('<strong>Toggle Debug:</strong> Double click/tap');
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
    const propertiesManager = getCustomizablePropertiesManager(target.constructor);
    propertiesManager.addProperty(folderPath, property, controllers);
  }
}

export function Callable(folderPath: string, name: string) {
  return function(target: any, property: string, descriptor: PropertyDescriptor) {
    const propertiesManager = getCustomizablePropertiesManager(target.constructor);
    propertiesManager.addCallable(folderPath, property, name, descriptor.value);
  }
}

function getCustomizablePropertiesManager(instance: any): CustomizablePropertiesManager {
  if(!instance.customizableProperties) {
    instance.customizableProperties = new CustomizablePropertiesManager();
  }
  return instance.customizableProperties;
}
