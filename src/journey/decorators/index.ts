import { CameraSettings, ExerciseSettings } from "../types";

export function Exercise(settings: ExerciseSettings) {
  if(!settings.id) {
    throw new Error('Exercise id is required');
  }
  return function(constructor: any): any {
    return class extends constructor {
      public static id: string = settings.id;
      public static info: string[] = [];

      constructor() {
        super();
        if(settings.description) {
          this.info.push(settings.description);
        }
      }
    }
  }
}

export function Camera(settings: CameraSettings): any {
  return function(constructor: any) {
    return class extends constructor {
      constructor() {
        super();
        if(settings.initialPosition) {
          this.settings.camera.initialPosition = settings.initialPosition;
        }
      }
    }
  }
};

