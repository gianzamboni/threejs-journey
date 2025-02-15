import DebugUI from "@/app/layout/debug-ui";
import GUI, { Controller } from "lil-gui";

export type CustomizableController = {
  propertyPath: string;
  isColor?: boolean;
  isCallable?: boolean;
  initialValue?: any;
  configuration?: {
    min?: number;
    max?: number;
    step?: number;
    name?: string;
    onChange?: string;
    onFinishChange?: string;
  };
}

type RegisteredProperty = {
  name: string;
  folderPath: string;
  controllers: CustomizableController[];
}

type CustomizableData = {
  object: any;
  propertyName: string;
}

type Callable = {
  propertyName: string;
  folderPath: string;
  name: string;
  value: Function;
}

export class CustomizablePropertiesManager {

  private debugObject: any;

  private gui: GUI | undefined;
  private instance: any | undefined;

  private registeredProperties: RegisteredProperty[];
  private registeredCallables: Callable[];

  constructor() {  
    this.registeredProperties = [];
    this.registeredCallables = [];
    this.debugObject = {};
  }

  init(instance: any, debugUI: DebugUI) {
    this.gui = debugUI.gui;
    this.instance = instance;
    this.registeredProperties.forEach((property) => {
      const folder = this.getFolder(property.folderPath);
      this.addControllers(folder, property);
    });

    this.registeredCallables.forEach((callable) => {
      const folder = this.getFolder(callable.folderPath);
      folder.add(this.instance, callable.propertyName).name(callable.name);
    });
  }

  addProperty(folderPath: string, property: string, controllers: CustomizableController[]) {
    this.registeredProperties.push({
      name: property,
      folderPath,
      controllers
    });
  }

  private addControllers(folder: GUI, registeredProperty: RegisteredProperty) {
    registeredProperty.controllers.forEach(controller =>{
      const customizableData = this.findCustomizableObject(registeredProperty.name, controller);
      let guiController = this.createGUIController(folder, customizableData, controller);
      this.applyConfiguration(guiController, controller);
    });
  }

  public addCallable(folderPath: string, propertyName: string, name: string, value: Function) {
    this.registeredCallables.push({
      folderPath,
      propertyName,
      name,
      value
    });
  }

  private findCustomizableObject(property: string, controller: CustomizableController): CustomizableData { 
    const needsDebugObject = this.controllerNeedsDebugObject(controller);

    const propertyPathParts = controller.propertyPath.split('.');
    propertyPathParts.unshift(property);

    const customizableProperty = propertyPathParts.pop();
    if(!customizableProperty) {
      throw new Error(`Invalid property path: ${controller.propertyPath}`);
    }

    const customizableObject = needsDebugObject 
      ? this.createDebugPath(propertyPathParts, controller, customizableProperty) 
      : this.getInstancePath(propertyPathParts, customizableProperty); 
    return {
      object: customizableObject,
      propertyName: customizableProperty
    };
  }

  private createDebugPath(propertyPathParts: string[], controller: CustomizableController, property: string) {
    console.log('createDebugPath', propertyPathParts, controller, property);
    const [object, original] = propertyPathParts.reduce(([obj, original]: any, prop: string) => {
      if(obj[prop] === undefined) {
        obj[prop] = {};
      }
      return [obj[prop], original[prop]];
    }, [this.debugObject, this.instance]);

    console.log(this.debugObject, original[property]);
    if(original[property] === undefined && controller.initialValue !== undefined) {
      object[property] = controller.initialValue;
    } else if(original[property] !== undefined) {
      object[property] = original[property];
    } else {
      throw new Error(`Invalid initial value for ${propertyPathParts}.${property}` );
    }
    
    return object;
  }

  private getInstancePath(propertyPathParts: string[], property: string) {
    const object = propertyPathParts.reduce((obj: any, prop: string) => {
      if(obj[prop] === undefined) {
        throw new Error(`Invalid property path: ${propertyPathParts}.${property}`);
      }
      return obj[prop];
    }, this.instance);

    if(object[property] === undefined) {
      throw new Error(`Invalid property path: ${propertyPathParts}.${property}`);
    }

    return object;
  }

  private createGUIController(folder: GUI, customizableData: CustomizableData, controller: CustomizableController): Controller {
    const addMethod = controller.isColor ? 'addColor' : 'add';
    return folder[addMethod](customizableData.object, customizableData.propertyName);
  }


  private applyConfiguration(guiController: Controller, controller: CustomizableController) {
    if(!controller.configuration) {
      return;
    }
    Object.entries(controller.configuration).forEach(([key, value]) => {
      if(key === 'onChange' || key === 'onFinishChange') {
        guiController[key](this.instance[value as keyof Controller].bind(this.instance))
      } else {
        guiController[key as keyof Controller](value);
      }
    });
  }
  
  private controllerNeedsDebugObject(controller: CustomizableController) {
    return controller.configuration !== undefined 
      && ['onChange', 'onFinishChange'].some((event) => event in controller.configuration!);
  }

  private getFolder(folderPath: string): GUI {
    if(this.gui === undefined) throw new Error('GUI not initialized');

    return folderPath.split('/').reduce((folder: GUI, folderName: string) => {
      const existingFolder = folder.folders.find(f => f._title === folderName);
      if(existingFolder) {
        return existingFolder;
      } else {
        return folder.addFolder(folderName);
      }
    }, this.gui);
  }
}