import { Controller } from "lil-gui";

import { Timer } from "three/examples/jsm/Addons.js";

import { ExerciseMetadata } from "#/app/utils/exercise-metadata";

type LilGuiControllerConfig = Omit<{
  [key in keyof Controller]?: Controller[key] extends Function ? any : never;
}, 'onChange' | 'onFinishChange'> & {
  onChange?: string;
  onFinishChange?: string;
}

export type ControllerConfig = {
  propertyPath: string;
  type?: 'callable' | 'color';
  settings?: LilGuiControllerConfig;
}

export function initDebugMetadata(context: ClassDecoratorContext | ClassMethodDecoratorContext | ClassFieldDecoratorContext): ExerciseMetadata.ExerciseMetadata {
  const metadata = context.metadata as ExerciseMetadata.ExerciseMetadata;
  if(metadata.isDebuggable === undefined) {
    metadata.isDebuggable = true;
    metadata.shouldSendData = false;
    metadata.descriptions = metadata.descriptions ?? [];
    metadata.descriptions.push('<strong>Toggle Debug</strong>: Double click/tap')
  }
  return metadata;
}

export function DebugFPS(target: Function, context: ClassMethodDecoratorContext) {
  const metadata = initDebugMetadata(context);
  return function(this: EventTarget, timer: Timer) {
    target.bind(this)(timer);
    if(metadata.shouldSendData) {
      const fps =  1 / timer.getDelta();
      (this as any).dispatchEvent(new CustomEvent('debug-info', { detail: { fps } }));
    }
  }
}
