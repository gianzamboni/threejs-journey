import { Controller } from "lil-gui";

import { Timer } from "three/examples/jsm/Addons.js";

import * as ExerciseMetadata from "#/app/utils/exercise-metadata";

type VoidFunction = (...args: unknown[]) => void;
type FrameFunction = (timer: Timer, ...args: unknown[]) => void;

type LilGuiControllerConfig = Omit<{
  [key in keyof Controller]?: Controller[key] extends VoidFunction ? unknown : never;
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

export function DebugFPS(target: FrameFunction, context: ClassMethodDecoratorContext) {
  const metadata = initDebugMetadata(context);
  return function(this: EventTarget, timer: Timer) {
    target.bind(this)(timer);
    if(metadata.shouldSendData) {
      const fps =  1 / timer.getDelta();
      (this as EventTarget).dispatchEvent(new CustomEvent('debug-info', { detail: { fps } }));
    }
  }
}
