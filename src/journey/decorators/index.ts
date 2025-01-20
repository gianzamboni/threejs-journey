import { ExerciseSettings } from "../types";
import { getDecoratorSettings } from './decorator-settings';
import { addSceneObjectsToScene } from './scene-objects';
import { setupAnimation } from './animation';
import { addDebugInfo } from "./debug-info";

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
        addDebugInfo(this, settings.debugInfo);
        setupAnimation(this, settings.animationMethod);
      }
    }
  }
}

