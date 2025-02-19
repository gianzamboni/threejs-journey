import { ExerciseClass } from "../types/exercise";

type ExerciseInitialMetadata = {
  id: string;
  descriptions?: string[];
}

export type ExerciseMetadata = Required<ExerciseInitialMetadata>;

export function Exercise(data: ExerciseInitialMetadata) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    context.metadata.id = data.id;
    context.metadata.descriptions = data.descriptions ?? [];
    return target;
  }
}

export function getMetadata(target: ExerciseClass): ExerciseMetadata {
  return target[Symbol.metadata] as ExerciseMetadata;
}