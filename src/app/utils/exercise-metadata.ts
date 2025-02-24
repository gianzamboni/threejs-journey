import { ExerciseControllers } from "../decorators/customizable";
import { ExerciseClass, Exercise } from "../types/exercise";

export namespace ExerciseMetadata {
  export type ExerciseMetadata = {
    id?: string;
    descriptions?: string[];
    controllersConfig?: ExerciseControllers;
    isAnimated?: boolean;
    isDebuggable?: boolean;
    shouldSendData?: boolean;
  }
  
  export function get(target: ExerciseClass | Exercise): ExerciseMetadata {
    let meta = (target as any)[Symbol.metadata];
    if(meta === undefined) {
      meta = target.constructor[Symbol.metadata];
    }

    return meta as ExerciseMetadata;
  }
  
  export function getId(target: ExerciseClass | Exercise): string {
    const metadata = get(target);
    if(metadata.id === undefined) {
      throw new Error('Exercise id is undefined');
    }
    return metadata.id;
  }
  
  export function getDescpritions(target: ExerciseClass | Exercise): string[] {
    const metadata = get(target);
    return metadata.descriptions ?? [];
  }
  
  export function isDebuggable(target: ExerciseClass | Exercise): boolean {
    const metadata = get(target);
    return metadata.isDebuggable ?? false;
  }
  
  export function isAnimated(target: ExerciseClass | Exercise): boolean {
    const metadata = get(target);
    return metadata.isAnimated ?? false;
  }

  export function getControllers(target: ExerciseClass | Exercise): ExerciseControllers {
    const metadata = get(target);
    return metadata.controllersConfig ?? {};
  }
}
