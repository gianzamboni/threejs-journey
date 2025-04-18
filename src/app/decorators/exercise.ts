import { Action, ButtonAction, ExerciseClass, SelectableAction } from "#/app/types/exercise";

export function Exercise(id: string) {
  return function<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
    context.metadata.id = id;
    return target;
  }
}

export function Description(...descriptions: string[]) {
  return function<T>(target: T, context: ClassDecoratorContext) {
    if(context.metadata.descriptions === undefined) {
      context.metadata.descriptions = [] as string[];
    }
    const targetDescriptions = context.metadata.descriptions as string[];
    targetDescriptions.unshift(...descriptions);
    return target;
  }
}

export function WithOrbitControllerDescription<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
  context.metadata.orbitControllerDescription = true;
  return target;
}

export function IsAnimated<T extends ExerciseClass>(target: T, context: ClassDecoratorContext) {
  context.metadata.isAnimated = true;
  return target;
}

export function ActionButton(label: string, icon: string) {
  return function(target: () => void, context: ClassMethodDecoratorContext) {
    if(context.metadata.actions === undefined) {
      context.metadata.actions = [] as ButtonAction[];
    }
    const actions = context.metadata.actions as ButtonAction[];
    actions.push({ label, icon, onClick: target, type: 'button' });
  }
}

export function Selectable(label: string, options: Record<string, unknown>) {
  return function(target: (...args: any[]) => void, context: ClassMethodDecoratorContext) {
    if(context.metadata.actions === undefined) {
      context.metadata.actions = [] as Action[];
    }
    const actions = context.metadata.actions as Action[];
    actions.push({ label, options, type: 'selectable', onChange: (evt: CustomEvent) => target(evt.detail.value) } as SelectableAction);
  }
}
