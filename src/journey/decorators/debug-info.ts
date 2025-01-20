/// <reference types="vite/client" />

import { DecoratorsUtils } from "./decorator-utils";
import { Timer } from 'three/addons/misc/Timer.js'

export function DebugFPS(targetClass: any, methodName: string) {
  const debugInfo = DecoratorsUtils.getDebugInfo(targetClass.constructor);
  debugInfo.fpsMethod = methodName;
}

export function addDebugInfo(exerciseInstance: any, debugInfo: DecoratorsUtils.DebugInfo | undefined) {
  exerciseInstance.isDebuggable = debugInfo !== undefined;
  exerciseInstance.debugActive = import.meta.env.MODE === 'development';
  if(!exerciseInstance.isDebuggable) return;
  exerciseInstance.toggleDebug = () => {
    exerciseInstance.debugActive = !exerciseInstance.debugActive;
  }
  createFPSCalculator(exerciseInstance, debugInfo?.fpsMethod);   
}

function createFPSCalculator(exerciseInstance: any, methodName: string | undefined) {
  if(methodName === undefined) return;
  const frame = exerciseInstance[methodName].bind(exerciseInstance);
  exerciseInstance[methodName] = (timer: Timer) => {
    if(exerciseInstance.debugActive) {
      exerciseInstance.dispatchEvent(new CustomEvent('debug-info', {
        detail: {
          fps: Math.round(1/timer.getDelta()),
        },
      }));
    }
    frame(timer);
  };
}