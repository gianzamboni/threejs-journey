import { AnimationLoop } from "@/utils/animation-loop";
import { ExerciseSettings } from "../types";

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
        this._addSceneObjectsToScene();
        this._generateAnimationMethods();
      }

      private _addSceneObjectsToScene() {
        const objectsKeys = constructor._sceneObjects;
        if(!objectsKeys) return;

        const objects = objectsKeys.map((key: string) => this[key]);
        this.scene.add(...objects);
      }

      private _generateAnimationMethods() {
        this.isAnimated = constructor._animationMethod !== undefined;
        if(!this.isAnimated) return;

        this._animationLoop = new AnimationLoop(this[constructor._animationMethod].bind(this));
        this.startAnimation = this._animationLoop.init.bind(this._animationLoop);
      }
    }
  }
}

export function SceneObject(targetClass: any, propertyKey: string) {
  if(!targetClass.constructor._sceneObjects) {
    targetClass.constructor._sceneObjects = []
  }
  targetClass.constructor._sceneObjects.push(propertyKey);
}

export function Animation(targetClass: any, methodName: string) {
  targetClass.constructor._animationMethod = methodName;
}
