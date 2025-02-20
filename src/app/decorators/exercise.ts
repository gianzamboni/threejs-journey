import { ExerciseClass } from "../types/exercise";

export type ExerciseMetadata = {
  id: string;
  descriptions?: string[];
}


export function Exercise(id: string) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    context.metadata.id = id;
    return target;
  }
}

export function getMetadata(target: ExerciseClass): ExerciseMetadata {
  return target[Symbol.metadata] as ExerciseMetadata;
}