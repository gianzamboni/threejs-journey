import { Controller } from "lil-gui";

import { initDebugMetadata } from "#/app/decorators/debug";

type ControllerFunction = (...args: unknown[]) => Controller;

type LilGuiControllerConfig = Omit<{
  [key in keyof Controller]?: Controller[key] extends ControllerFunction ? unknown : Parameters<Controller[key]>[0];
}, 'onChange' | 'onFinishChange'> & {
  onChange?: string;
  onFinishChange?: string;
}

export type ControllerConfig = {
  withDelay?: boolean;
  type?: 'color' | 'callable' | 'master';
  propertyPath?: string;  
  folderPath?: string;
  initialValue?: unknown;
  context?:  Record<string, unknown>;
  settings?: LilGuiControllerConfig;
}
 
export type ExerciseControllers = Record<string | symbol, ControllerConfig[]>;

function addControllersToMetadata(
  context: ClassFieldDecoratorContext | ClassMethodDecoratorContext, 
  newControllers: ControllerConfig[], 
  name: string | symbol
) {
  const metadata = initDebugMetadata(context);

  if(metadata.controllersConfig === undefined) {
    metadata.controllersConfig = {};
  }
  
  const controllers = metadata.controllersConfig as ExerciseControllers;
  if(controllers[name] === undefined) {
    controllers[name] = [];
  }
  controllers[name].push(...newControllers);
}

export function Customizable(newControllers: ControllerConfig[]) {
  return function(_: undefined, context: ClassFieldDecoratorContext) {
    addControllersToMetadata(context, newControllers, context.name);
  }
}

export function Callable<T>(folderPath: string, name: string, ...callableArgs: T[]) {
  return function( _ : (...args: T[]) => void, context: ClassMethodDecoratorContext) {
    addControllersToMetadata(context, [{ type: 'callable', folderPath, settings: { name }, context: { callableArgs } }], context.name);
  }
}

export function EnableCustomization() {
  return function(_: undefined, context: ClassFieldDecoratorContext) {
    console.log(context);
    let controllersConfig = context.metadata?.controllersConfig;
    if(controllersConfig === undefined) {
      controllersConfig = {};
    }
    console.log(controllersConfig);
  }
}