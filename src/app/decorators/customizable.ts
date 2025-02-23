import { Controller } from "lil-gui";
import { ExerciseMetadata } from "../utils/exercise-metadata";

export type ControllerSettings = Omit<{
  [key in keyof Controller]?: Controller[key] extends Function ? any : never;
}, 'onChange' | 'onFinishChange'> & {
  onChange?: string;
  onFinishChange?: string;
}

export type ControllerConfig = {
  type?: 'color' | 'callable' | 'master';
  propertyPath?: string;  
  folderPath?: string;
  initialValue?: any;
  settings?: ControllerSettings;
}
 
export type ExerciseControllers = Record<string | symbol, ControllerConfig[]>;

function addControllersToMetadata(
  context: ClassFieldDecoratorContext | ClassMethodDecoratorContext, 
  newControllers: ControllerConfig[], 
  name: string | symbol
) {
  const metadata = context.metadata as ExerciseMetadata.ExerciseMetadata;
  if(metadata.isDebuggable === undefined) {
    metadata.isDebuggable = true;
    metadata.descriptions = metadata.descriptions ?? [];
    metadata.descriptions.push('<strong>Toggle Debug</strong>: Double click/tap')
  }

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

export function Callable(folderPath: string, name: string,) {
  return function( _ : Function, context: ClassMethodDecoratorContext) {
    addControllersToMetadata(context, [{ type: 'callable', folderPath, settings: {name} }], context.name);
  }
}