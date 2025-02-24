import { ExerciseClass } from "../types/exercise";

export function Exercise(id: string) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    context.metadata.id = id;
    return target;
  }
}

export function Description(descriptions: string[]) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    if(context.metadata.descriptions === undefined) {
      context.metadata.descriptions = [] as string[];
    }
    const targetDescriptions = context.metadata.descriptions as string[];
    targetDescriptions.unshift(...descriptions);
    return target;
  }
}

export function OrbitControllerDescription(descriptions?: string[]) {
  if(descriptions === undefined) {
    descriptions = [];
  }
  return Description([
    ...descriptions,
    '<strong>Rotate:</strong> Click/Tap & drag',
    '<strong>Zoom:</strong> Scroll or pinch',
    '<strong>Pan:</strong> Two-finger Tap/Right click & drag',
  ])

}