import { ExerciseSettings } from "../types";
import { Timer } from 'three/addons/misc/Timer.js'
import { getDebugInfo, getDecoratorSettings } from './decorator-settings';
import { addSceneObjectsToScene } from './scene-objects';
import { setupAnimation } from './animation';

function assertValidSettings(settings: ExerciseSettings) {
  if(!settings.id) {
    throw new Error('Exercise id is required');
  }
}

function getInitialInfo(settings: ExerciseSettings) {
  const initialInfo =  [];
  if(settings.description) {
    initialInfo.push(settings.description);
  }
  return initialInfo; 
}

export function Exercise(settings: ExerciseSettings) {
  assertValidSettings(settings);
  const initialInfo = getInitialInfo(settings);
  return function(constructor: any): any {
    return class extends constructor {
      public static id: string = settings.id;
      public static info: string[] = initialInfo;

      constructor() {
        super();
        const settings = getDecoratorSettings(constructor);
        addSceneObjectsToScene(this, settings.sceneMeshes);
        //this._addDebugInfo();
        setupAnimation(this, settings.animationMethod);
      }

      private _addDebugInfo() {
        this.isDebuggable = constructor._debuggable;
        if(this.isDebuggable) {
          this._debug_info = {};
          if(constructor._fpsMethod) {
            this._createFPSCalculator();
          }
        }
      }

      private _createFPSCalculator() {
        this._debug_info.fps = {
          samples: 0,
          value: 0,
        }

        const frame = this[constructor._fpsMethod].bind(this);

        this[constructor._fpsMethod] = (timer: Timer) => {
          const fpsInfo = this._debug_info.fps;
          fpsInfo.samples++;
          const newSampleValue = 1/timer.getDelta();
          fpsInfo.value = fpsInfo.value + (newSampleValue - fpsInfo.value) / fpsInfo.samples;
          this.dispatchEvent(new CustomEvent('debug-info', {
            detail: {
              fps: Math.round(this._debug_info.fps.value),
            },
          }));
          frame(timer);
        };
        console.log(this.frame);
      }
    }
  }
}

export function DebugFPS(targetClass: any, methodName: string, descriptor: any) {
  const debugInfo = getDebugInfo(targetClass.constructor);
  debugInfo.fps = {
    method: methodName,
    samples: 0,
    value: 0,
  }
  targetClass.constructor._fpsMethod = methodName;
}