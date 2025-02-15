import DebugUI from "@/app/layout/debug-ui";
import GUI, { Controller } from "lil-gui";

export type CustomizableController = {
  propertyPath: string;
  isColor?: boolean;
  isCallable?: boolean;
  initialValue?: any;
  folderPath?: string;
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
  controllers: CustomizableController[];
}

type RegisteredDictionaries = {
  name: string;
  controllers: {
    default?: CustomizableController[]
  };
}

type CustomizableData = {
  object: any;
  propertyName: string;
}

type Callable = {
  propertyName: string;
  folderPath: string;
  name: string;
}

export class CustomizablePropertiesManager {

  private debugObject: any;

  private gui: GUI | undefined;
  private instance: any | undefined;

  private registeredProperties: RegisteredProperty[];
  private registeredCallables: Callable[];

  private registeredDictionaries: RegisteredDictionaries[];

  constructor() {  
    this.registeredProperties = [];
    this.registeredCallables = [];
    this.registeredDictionaries = [];
    this.debugObject = {};
  }

  init(instance: any, debugUI: DebugUI) {
    this.gui = debugUI.gui;
    this.instance = instance;

    this.registeredDictionaries.forEach((dictionary) => {
      this.registerControllersForDictionary(dictionary);
    });

    this.registeredProperties.forEach((property) => {
      this.addControllers(property);
    });

    this.registeredCallables.forEach((callable) => {
      const folder = this.getFolder(callable.folderPath);
      folder.add(this.instance, callable.propertyName).name(callable.name);
    });
  }

  addProperty(property: string, controllers: CustomizableController[]) {
    this.registeredProperties.push({
      name: property,
      controllers
    });
  }

  addPropertyToValues(property: string, controllers: { default: CustomizableController[]; }) {
    this.registeredDictionaries.push({
      name: property,
      controllers
    });
  }

  private registerControllersForDictionary(dictionary: RegisteredDictionaries) {
    const instanceDict = this.instance[dictionary.name];
    Object.entries(instanceDict).forEach((key, value) => {
      console.log(key, value);
    });
  }

  private addControllers(registeredProperty: RegisteredProperty) {
    registeredProperty.controllers.forEach(controller =>{
      const folder = this.getFolder(controller.folderPath);
      const customizableData = this.findCustomizableObject(registeredProperty.name, controller);
      let guiController = this.createGUIController(folder, customizableData, controller);
      this.applyConfiguration(guiController, controller);
    });
  }

  public addCallable(folderPath: string, propertyName: string, name: string) {
    this.registeredCallables.push({
      folderPath,
      propertyName,
      name,
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
    const [object, original] = propertyPathParts.reduce(([obj, original]: any, prop: string) => {
      if(obj[prop] === undefined) {
        obj[prop] = {};
      }
      return [obj[prop], original[prop]];
    }, [this.debugObject, this.instance]);

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

  private getFolder(folderPath: string | undefined): GUI {
    if(this.gui === undefined) throw new Error('GUI not initialized');
    if(!folderPath) {
      return this.gui;
    }
    
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