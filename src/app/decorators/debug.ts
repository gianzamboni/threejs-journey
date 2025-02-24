import { Timer } from "three/examples/jsm/Addons.js";
import { ExerciseMetadata } from "../utils/exercise-metadata";

export function initDebugMetadata(context: ClassFieldDecoratorContext | ClassMethodDecoratorContext): ExerciseMetadata.ExerciseMetadata {
  const metadata = context.metadata as ExerciseMetadata.ExerciseMetadata;
  console.log(metadata);
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