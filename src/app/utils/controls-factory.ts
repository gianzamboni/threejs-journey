import GUI, { Controller } from "lil-gui";
import { ExerciseMetadata } from "./exercise-metadata";
import { ControllerConfig } from "../decorators/customizable";
import { printable } from "./text-utils";

type CustomizableData = {
  object: any;
  propertyName: string;
}
export class ControllerFactory {

  private gui: GUI;
  private exercise: any;
  private debugObject: any;

  public constructor(gui: GUI, exercise: any) {
    this.gui = gui;
    this.exercise = exercise;
    this.exercise._ControllerFactory_debugObject = {};
    this.debugObject = this.exercise._ControllerFactory_debugObject;
    console.log('debugObject', this.debugObject);
  }

  public create() {
    const controllersConfig = ExerciseMetadata.getControllers(this.exercise);
    for (const key in controllersConfig) {
      this.createControllers(key, controllersConfig[key]);
    }
  }

  public createControllers(key: string, controllersConfig: ControllerConfig[]) {
    controllersConfig.forEach(config => {
      this.createController(key, config);
    })
  }

  private createController(key: string, config: ControllerConfig) {
    const folder = this.getFolder(config.folderPath);
    const customizableObject = this.findCustomizableObject(key, config);
    const controller = folder.add(customizableObject.object, customizableObject.propertyName);
    console.log(key, config.settings?.name, customizableObject);
    for(let setting in config.settings) {
        controller[setting as keyof Controller](config.settings[setting as keyof Controller] as Parameters<Controller[keyof Controller]>[0]);
    }

    if(config.settings?.name === undefined) {
      controller.name(printable(customizableObject.propertyName));
    }
  }

  private getFolder(folderPath: string | undefined): GUI {
    if (this.gui === undefined) throw new Error('GUI not initialized');
    if (!folderPath) {
      return this.gui;
    }

    return folderPath.split('/').reduce((folder: GUI, folderName: string) => {
      const existingFolder = folder.folders.find(f => f._title === folderName);
      if (existingFolder) {
        return existingFolder;
      } else {
        return folder.addFolder(folderName);
      }
    }, this.gui);
  }

  private findCustomizableObject(key: string, config: ControllerConfig): CustomizableData {
    if(config.propertyPath === undefined || config.propertyPath.length === 0) {
      return { object: this.exercise, propertyName: key };
    }

    const path = config.propertyPath.split('.');
    const propertyName = path.pop() as string;

    const object = path.reduce((object, property) => {
      return object[property];      
    }, this.exercise[key]);

    return { object, propertyName };
  }
}
