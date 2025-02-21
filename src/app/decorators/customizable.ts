// import DebugUI from "@/app/layout/debug-ui";
// import { printable } from "@/app/utils/text-utils";
// import GUI, { Controller } from "lil-gui";

// export type CustomizableControllerConfig = {
//   propertyPath: string;
//   isColor?: boolean;
//   isCallable?: boolean;
//   isMaster?: boolean;
//   initialValue?: any;
//   folderPath?: string;
//   eventArgs?: any;
//   configuration?: {
//     min?: number;
//     max?: number;
//     step?: number;
//     name?: string;
//     onChange?: string;
//     onFinishChange?: string;
//   };
// }


// type RegisteredProperty = {
//   name: string;
//   controllers: CustomizableControllerConfig[];
// }

// type RegisteredDictionaries = {
//   name: string;
//   controllers: {
//     [key: string]: CustomizableControllerConfig[];
//   };
// }

// export type RegexControllerDict = Record<string, CustomizableControllerConfig[]>;

// type CustomizableData = {
//   object: any;
//   propertyName: string;
// }

// type Callable = {
//   propertyName: string;
//   folderPath: string;
//   name: string;
// }

// export class CustomizablePropertiesManager {

//   private debugObject: any;

//   private gui: GUI | undefined;
//   private instance: any | undefined;

//   private registeredProperties: RegisteredProperty[];
//   private registeredCallables: Callable[];

//   private processDictionaries: boolean;
//   private registeredDictionaries: RegisteredDictionaries[];

//   constructor() {  
//     this.registeredProperties = [];
//     this.registeredCallables = [];
//     this.registeredDictionaries = [];
//     this.debugObject = {};
//     this.processDictionaries = true;
//   }

//   init(instance: any, debugUI: DebugUI) {
//     this.gui = debugUI.gui;
//     this.instance = instance;
    
//     if(this.processDictionaries) {
//       this.registeredDictionaries.forEach((dictionary) => {
//         this.registerControllersForDictionary(dictionary);
//       });
//       this.processDictionaries = false;
//     };

//     this.registeredProperties.forEach((property) => {
//       this.addControllers(property);
//     });

//     this.registeredCallables.forEach((callable) => {
//       const folder = this.getFolder(callable.folderPath);
//       folder.add(this.instance, callable.propertyName).name(callable.name);
//     });
//   }

//   dispose() {
//     this.gui?.destroy();
//   }

//   addProperty(property: string, controllers: CustomizableControllerConfig[]) {
//     this.registeredProperties.push({
//       name: property,
//       controllers
//     });
//   }

//   addPropertyToValues(property: string, controllers: RegexControllerDict) {
//     this.registeredDictionaries.push({
//       name: property,
//       controllers
//     });
//   }

//   private registerControllersForDictionary(dictionary: RegisteredDictionaries) {
//     const instanceDict = this.instance[dictionary.name];
//     const propertyName = dictionary.name;
//     const customizableControllers: CustomizableControllerConfig[] = [];

//     Object.keys(instanceDict).forEach(key => {
//       Object.entries(dictionary.controllers).forEach(([regex, controllers]) => {
//         const expression = new RegExp(regex);
//         if(expression.test(key)) {
//           controllers.forEach(controller => {
//             const newController: CustomizableControllerConfig = { ...controller };
//             newController.propertyPath = `${key}.${controller.propertyPath}`;
//             newController.folderPath = controller.folderPath ? `${printable(key)}/${controller.folderPath}` : printable(key);
//             if(controller.eventArgs === undefined) {
//               newController.eventArgs = [key];
//             } else {
//               newController.eventArgs.unshift(key);
//             }
//             customizableControllers.push(newController);
//           });
//         }
//       });
//     });

//     this.addProperty(propertyName, customizableControllers);
//   }

//   private addControllers(registeredProperty: RegisteredProperty) {
//     registeredProperty.controllers.forEach(controller =>{
//       const folder = this.getFolder(controller.folderPath);
//       const customizableData = this.findCustomizableObject(registeredProperty.name, controller);
//       let guiController = this.createGUIController(folder, customizableData, controller);
//       this.applyConfiguration(guiController, controller, customizableData, folder);
//     });
//   }

//   public addCallable(folderPath: string, propertyName: string, name: string) {
//     this.registeredCallables.push({
//       folderPath,
//       propertyName,
//       name,
//     });
//   }

//   private findCustomizableObject(property: string, controller: CustomizableControllerConfig): CustomizableData { 
//     const needsDebugObject = this.controllerNeedsDebugObject(controller);

//     const propertyPathParts = controller.propertyPath.split('.');
//     propertyPathParts.unshift(property);

//     const customizableProperty = propertyPathParts.pop();
//     if(!customizableProperty) {
//       throw new Error(`Invalid property path: ${controller.propertyPath}`);
//     }

//     const customizableObject = needsDebugObject 
//       ? this.createDebugPath(propertyPathParts, controller, customizableProperty) 
//       : this.getInstancePath(propertyPathParts, customizableProperty); 
//     return {
//       object: customizableObject,
//       propertyName: customizableProperty
//     };
//   }

//   private createDebugPath(propertyPathParts: string[], controller: CustomizableControllerConfig, property: string) {
//     const [object, original] = propertyPathParts.reduce(([obj, original]: any, prop: string) => {
//       if(obj[prop] === undefined) {
//         obj[prop] = {};
//       }
//       return [obj[prop], original[prop]];
//     }, [this.debugObject, this.instance]);

//     if(original[property] === undefined && controller.initialValue !== undefined) {
//       object[property] = controller.initialValue;
//     } else if(original[property] !== undefined) {
//       object[property] = original[property];
//     } else {
//       throw new Error(`Invalid initial value for ${propertyPathParts}.${property}` );
//     }
    
//     return object;
//   }

//   private getInstancePath(propertyPathParts: string[], property: string) {
//     const object = propertyPathParts.reduce((obj: any, prop: string) => {
//       if(obj[prop] === undefined) {
//         throw new Error(`Invalid property path: ${propertyPathParts}.${property}`);
//       }
//       return obj[prop];
//     }, this.instance);

//     if(object[property] === undefined) {
//       throw new Error(`Invalid property path: ${propertyPathParts}.${property}`);
//     }

//     return object;
//   }

//   private createGUIController(folder: GUI, customizableData: CustomizableData, controller: CustomizableControllerConfig): Controller {
//     const addMethod = controller.isColor ? 'addColor' : 'add';
//     return folder[addMethod](customizableData.object, customizableData.propertyName);
//   }


//   private applyConfiguration(guiController: Controller, controller: CustomizableControllerConfig, customizableData: CustomizableData, folder: GUI) {
//     if(!controller.configuration) {
//       controller.configuration = {};
//     }
//     Object.entries(controller.configuration).forEach(([key, value]) => {
//       if(key === 'onChange' || key === 'onFinishChange') {
//         guiController[key]((newValue: any) => {
//           this.instance[value as keyof Controller](newValue, ...(controller.eventArgs ?? []) , customizableData.object);
//           if(controller.isMaster) {
//             this.toggleControllers(folder, newValue, guiController);
//           }
//         })
//       } else {
//         guiController[key as keyof Controller](value);
//       }
//     });

//     if(!('name' in controller.configuration)) {
//       guiController.name(printable(customizableData.propertyName));
//     }
//   }
  
//   private toggleControllers(folder: GUI, newValue: boolean, guiController: Controller) {
//     folder.controllersRecursive().forEach((controller) => {
//       if(newValue === true) {
//         controller.enable();
//       } else if(controller.$name !== guiController.$name) {
//         controller.disable();
//       }
//     });
//   }
//   private controllerNeedsDebugObject(controller: CustomizableControllerConfig) {
//     return controller.configuration !== undefined 
//       && ['onChange', 'onFinishChange'].some((event) => event in controller.configuration!);
//   }

//   private getFolder(folderPath: string | undefined): GUI {
//     if(this.gui === undefined) throw new Error('GUI not initialized');
//     if(!folderPath) {
//       return this.gui;
//     }

//     return folderPath.split('/').reduce((folder: GUI, folderName: string) => {
//       const existingFolder = folder.folders.find(f => f._title === folderName);
//       if(existingFolder) {
//         return existingFolder;
//       } else {
//         return folder.addFolder(folderName);
//       }
//     }, this.gui);
//   }
// }

type ControllerConfig = {
  folderPath?: string;
  constraints?: {
    min?: number;
    max?: number;
    step?: number;
    label?: string;
  }
}

export interface CustomizableProperties {
  [key: string | symbol]: ControllerConfig | CustomizableProperties;
}

export function Customizable(newControllers: CustomizableProperties) {
  return function(_: undefined, context: ClassFieldDecoratorContext) {
    if(context.metadata.controllersConfig === undefined) {
      context.metadata.controllersConfig = {};
    } 
    const controllers = context.metadata.controllersConfig as CustomizableProperties;
    controllers[context.name] = newControllers;
  }
}