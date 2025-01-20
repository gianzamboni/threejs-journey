import { AnimationLoop } from "@/utils/animation-loop";

export type DebugInfo = {
  fpsMethod?: string;
}

export type DecoratorSettings = {
  sceneMeshes?: string[];
  animationMethod?: string;
  debugInfo?: DebugInfo
}

export type DecoratorExtraProperties = {
  animationLoop?: AnimationLoop;
  debugInfo?: DebugInfo;
}

export function getDecoratorSettings(constructor: any): DecoratorSettings {
  if(constructor._decoratorSettings === undefined) {
    constructor._decoratorSettings = {};
  };
  return constructor._decoratorSettings;
}

export function getDebugInfo(constructor: any): DebugInfo {
  const settings = getDecoratorSettings(constructor);
  if(!settings.debugInfo) {
    settings.debugInfo = {};
  }
  return settings.debugInfo;
}

export function getDecoratorExtraProperies(exerciseInstance: any): DecoratorExtraProperties {
  if(exerciseInstance._extraProperties === undefined) {
    exerciseInstance._extraProperties = {};
  }
  return exerciseInstance._extraProperties;
}