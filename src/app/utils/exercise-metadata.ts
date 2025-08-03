import { ExerciseControllers } from "#/app/decorators/customizable";
import { ExerciseClass, Exercise, Action } from "#/app/types/exercise";
import { CSS_CLASSES } from "#/theme";

export type ExerciseMetadata = {
  id?: string;
  actions?: Action[];
  descriptions?: string[];
  controllersConfig?: ExerciseControllers;
  orbitControllerDescription?: boolean;
  isAnimated?: boolean;
  isDebuggable?: boolean;
  shouldSendData?: boolean;
  isStarred?: boolean;
  customizableQuality?: boolean;
}

export type WithMetadata<T> = T & {
  [Symbol.metadata]?: ExerciseMetadata | null;
}

export type MetadataTarget = WithMetadata<ExerciseClass | Exercise>;

const ORBIT_CONTROLLER_DESCRIPTION = `
  <p><strong>Rotate:</strong> <span class="${CSS_CLASSES.light_text}">Click/Tap & drag</span></p>
  <p><strong>Zoom:</strong> <span class="${CSS_CLASSES.light_text}">Scroll or pinch</span></p>
  <p><strong>Pan:</strong> <span class="${CSS_CLASSES.light_text}">Two-finger Tap/Right click & drag</span></p>
`;

const DEBUG_CONTROLLER_DESCRIPTION = `
  <p><strong>Toggle Debug</strong>: <span class="${CSS_CLASSES.light_text}">Double click/tap</span></p>
`;

/**
 * Get all metadata from a target
 */
export function getMetadata(target: MetadataTarget): ExerciseMetadata {
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
  const metadata = getMetadata(target);
  if(metadata.id === undefined) {
    throw new Error('Exercise id is undefined');
  }
  return metadata.id;
}

export function getStarred(target: MetadataTarget): boolean {
  const metadata = getMetadata(target);
  return metadata.isStarred ?? false;
}

/**
 * Get descriptions from a target's metadata
 */
export function getDescriptions(target: MetadataTarget): string[] {
  const metadata = getMetadata(target);
  const descriptions = [...(metadata.descriptions ?? [])];

  if(metadata.orbitControllerDescription || metadata.isDebuggable) {
    descriptions.push(
      `<div style="margin-top: 10px;">
        ${
          metadata.orbitControllerDescription ? ORBIT_CONTROLLER_DESCRIPTION : ''
        }
        ${
          metadata.isDebuggable ? DEBUG_CONTROLLER_DESCRIPTION : ''
        }
        <p><strong>Toggle Layout</strong>: <span class="text-gray-800 dark:text-gray-300">Press H on keyboard</span></p>
      </div>`
    );
  }
  return [
    ...descriptions,
  ];
}

/**
 * Check if a target is debuggable based on its metadata
 */
export function isDebuggable(target: MetadataTarget): boolean {
  const metadata = getMetadata(target);
  return metadata.isDebuggable ?? false;
}

/**
 * Check if a target is animated based on its metadata
 */
export function isAnimated(target: MetadataTarget): boolean {
  const metadata = getMetadata(target);
  return metadata.isAnimated ?? false;
}

/**
 * Get controllers configuration from a target's metadata
 */
export function getControllers(target: MetadataTarget): ExerciseControllers {
  const metadata = getMetadata(target);
  return metadata.controllersConfig ?? {};
}

export function hasControllers(target: MetadataTarget): boolean {
  const controllers = getControllers(target);
  return Object.keys(controllers).length > 0;
}

export function getActions(target: MetadataTarget): Action[] {
  const metadata = getMetadata(target);
  return metadata.actions ?? [];
}

export function hasQualityOptions(target: MetadataTarget): boolean {
  const metadata = getMetadata(target);
  return metadata.customizableQuality ?? false;
}