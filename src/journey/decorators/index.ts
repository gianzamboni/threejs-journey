import { ExerciseSettings } from "../types";
import { DecoratorsUtils } from './decorator-utils';
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
  const exerciseId = settings.id;
  return function(constructor: any): any {
    return class extends constructor {
      public static id: string = exerciseId;
      
      constructor() {
        super();
        const settings = DecoratorsUtils.getSettings(constructor);
        const extraProperties = DecoratorsUtils.getExtraProperties(this);
        extraProperties.description = initialInfo;

        addSceneObjectsToScene(this, settings.sceneMeshes);
        addDebugInfo(this, settings.debugInfo);
        setupAnimation(this, settings.animationMethod);
      }

      get description() {
        return DecoratorsUtils.getExtraProperties(this).description;
      }

      get id() {
        return exerciseId;
      }
    }
  }
}

