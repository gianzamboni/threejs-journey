import BaseExercise from "../types/exercises/base-exercise";
import DebugUI from "../layout/debug-ui";
import { Quality } from "../layout/quality-selector";
import RenderView from "../layout/render-view";

type ExerciseMetadata = {
  id: string;
}

export type ExerciseClass = new (renderView: RenderView, quality: Quality, debugUI? : DebugUI) => BaseExercise;

export function Exercise(data: ExerciseMetadata) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    //console.log('Exercise', data, target, context);
    context.metadata.id = data.id;
    //console.log(context.metadata);
    return target;
  }
}

export function getMetadata(target: ExerciseClass): ExerciseMetadata {
  return target[Symbol.metadata] as ExerciseMetadata;
}