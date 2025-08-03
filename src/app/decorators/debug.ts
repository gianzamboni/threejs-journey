import { Timer } from 'three/addons/misc/Timer.js';

import { ExerciseMetadata } from '#/app/utils/exercise-metadata';

import { ExerciseClass } from '../types/exercise';

type FrameFunction = (timer: Timer, ...args: unknown[]) => void;

export function initDebugMetadata(context: ClassDecoratorContext | ClassMethodDecoratorContext | ClassFieldDecoratorContext): ExerciseMetadata {
  const metadata = context.metadata as ExerciseMetadata;
  if(metadata.isDebuggable === undefined) {
    metadata.isDebuggable = true;
    metadata.shouldSendData = false;
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

export function CustomizableQuality(_: ExerciseClass, context: ClassDecoratorContext) {
    const metadata = initDebugMetadata(context);
    metadata.customizableQuality = true;
}