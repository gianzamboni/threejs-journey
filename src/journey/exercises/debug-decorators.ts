import { Timer } from 'three/addons/misc/Timer.js';
import { ExerciseClass } from '../types';

type DebuggableExercise =  ExerciseClass & {
  isDebuggable: boolean;
  shouldDebug: boolean;
  toggleDebug: () => void;
}

export function Debuggable(constructor: ExerciseClass ): any {
  return class extends constructor {
    public isDebuggable: boolean = true;
    public shouldDebug = false;

    constructor() {
      super();
    }

    toggleDebug() {
      this.shouldDebug = !this.shouldDebug;
    }
  }
}

export function DebugFPS(_: any, _1: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(timer: Timer) {
    if((this as DebuggableExercise).shouldDebug) {
      originalMethod.call(this, timer);
      const fps = 1/timer.getDelta();
      (this as EventTarget).dispatchEvent(new CustomEvent('debug-info', { detail: { fps } }));
    }
  };
  return descriptor;
}