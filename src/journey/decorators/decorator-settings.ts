import { AnimationLoop } from "@/utils/animation-loop";

export type DebugInfo = {
  fps?: {
    method: string;
    samples: number;
    value: number;
  }
}

export type DecoratorSettings = {
  sceneMeshes?: string[];
  animationMethod?: string;
  debugInfo?: DebugInfo
}

export type DecoratorExtraProperties = {
  animationLoop?: AnimationLoop;
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

export function getDecoratorExtraProperies(exerciseInstance: any) {
  if(exerciseInstance._extraProperties === undefined) {
    exerciseInstance._extraProperties = {};
  }
  return exerciseInstance._extraProperties;
}