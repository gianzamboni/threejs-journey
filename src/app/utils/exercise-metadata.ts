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

export type WithMetadata<T> = T & {
  [Symbol.metadata]?: ExerciseMetadata | null;
}

export type MetadataTarget = WithMetadata<ExerciseClass | Exercise>;

/**
 * Get all metadata from a target
 */
export function get(target: MetadataTarget): ExerciseMetadata {
  let meta = target[Symbol.metadata];
  if(meta === undefined || meta === null) {
    meta = target.constructor[Symbol.metadata] as ExerciseMetadata;
  }

  return meta as ExerciseMetadata;
}

/**
 * Get the ID from a target's metadata
 */
export function getId(target: MetadataTarget): string {
  const metadata = get(target);
  if(metadata.id === undefined) {
    throw new Error('Exercise id is undefined');
  }
  return metadata.id;
}

/**
 * Get descriptions from a target's metadata
 */
export function getDescriptions(target: MetadataTarget): string[] {
  const metadata = get(target);
  return metadata.descriptions ?? [];
}

/**
 * Check if a target is debuggable based on its metadata
 */
export function isDebuggable(target: MetadataTarget): boolean {
  const metadata = get(target);
  return metadata.isDebuggable ?? false;
}

/**
 * Check if a target is animated based on its metadata
 */
export function isAnimated(target: MetadataTarget): boolean {
  const metadata = get(target);
  return metadata.isAnimated ?? false;
}

/**
 * Get controllers configuration from a target's metadata
 */
export function getControllers(target: MetadataTarget): ExerciseControllers {
  const metadata = get(target);
  return metadata.controllersConfig ?? {};
}
