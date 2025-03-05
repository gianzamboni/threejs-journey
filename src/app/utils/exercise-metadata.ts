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

  if(meta === undefined || meta === null) {
    meta = {};
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
  const descriptions = metadata.descriptions ?? [];
  const keysDescriptions = [];
  for(const key in target) {
    const value = target[key as unknown as keyof MetadataTarget];
    if(value === undefined) {
      continue;
    }
    const valueMetadata = get(value as MetadataTarget);
    if(valueMetadata.descriptions) {
      keysDescriptions.push(...valueMetadata.descriptions);
    }
  }
  return [
    ...descriptions,
    ...keysDescriptions,
  ];
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

export function hasControllers(target: MetadataTarget): boolean {
  const controllers = getControllers(target);
  return Object.keys(controllers).length > 0;
}
