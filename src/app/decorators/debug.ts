import { Timer } from "three/examples/jsm/Addons.js";

import { ExerciseMetadata } from "../utils/exercise-metadata";

type FrameFunction = (timer: Timer, ...args: unknown[]) => void;

export function initDebugMetadata(context: ClassDecoratorContext | ClassMethodDecoratorContext | ClassFieldDecoratorContext): ExerciseMetadata {
  const metadata = context.metadata as ExerciseMetadata;
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
