import { ExerciseControllers } from "#/app/decorators/customizable";
import { ExerciseClass, Exercise } from "#/app/types/exercise";

export type ExerciseMetadata = {
  id?: string;
  descriptions?: string[];
  controllersConfig?: ExerciseControllers;
  isAnimated?: boolean;
  isDebuggable?: boolean;
  shouldSendData?: boolean;
}


type WithMetadata<T> = T & {
  [Symbol.metadata]?: ExerciseMetadata;
}

export function get(target: WithMetadata<ExerciseClass | Exercise>): ExerciseMetadata {
  let meta = target[Symbol.metadata];
  if(meta === undefined) {
    meta = target.constructor[Symbol.metadata] as ExerciseMetadata;
  }

  return meta as ExerciseMetadata;
}

export function getId(target: WithMetadata<ExerciseClass | Exercise>): string {
  const metadata = get(target);
  if(metadata.id === undefined) {
    throw new Error('Exercise id is undefined');
  }
  return metadata.id;
}

export function getDescpritions(target: WithMetadata<ExerciseClass | Exercise>): string[] {
  const metadata = get(target);
  return metadata.descriptions ?? [];
}

export function isDebuggable(target: WithMetadata<ExerciseClass | Exercise>): boolean {
  const metadata = get(target);
  return metadata.isDebuggable ?? false;
}

export function isAnimated(target: WithMetadata<ExerciseClass | Exercise>): boolean {
  const metadata = get(target);
  return metadata.isAnimated ?? false;
}

export function getControllers(target: WithMetadata<ExerciseClass | Exercise>): ExerciseControllers {
  const metadata = get(target);
  return metadata.controllersConfig ?? {};
}
