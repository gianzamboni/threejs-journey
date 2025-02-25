import { ControllerConfig } from "@/app/decorators/customizable";
import { ExerciseMetadata } from "@/app/utils/exercise-metadata";
import { getPathArray, printable } from "@/app/utils/text-utils";
import GUI, { Controller } from "lil-gui";

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
    const isColor = config.type === 'color';
    const controller = folder[isColor? 'addColor':'add'](customizableObject.object, customizableObject.propertyName);

    Object.entries(config.settings ?? {}).forEach(([setting, value]) => {
      if (setting === 'onChange' || setting === 'onFinishChange') {
        controller[setting as keyof Controller](this.exercise[value].bind(this.exercise));
      } else {

        controller[setting as keyof Controller](value);
      }
    });

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

    const path = getPathArray(config.propertyPath);
    path.unshift(key);
    console.log(path);
    const propertyName = path.pop() as string;

    const object = path.reduce((object, property) => {
      return object[property];      
    }, this.exercise);

    if(this.needsDebugObject(config)) {
      const propertyValue = object[propertyName] ?? config.initialValue;
      if(propertyValue === undefined) {
        throw new Error(`Customizable property ${config.propertyPath} should have an initial value`);
      }
      this.debugObject[`${key}.${config.propertyPath}`] = propertyValue;
      return { object: this.debugObject, propertyName: `${key}.${config.propertyPath}` };
    }
    return { object, propertyName };
  }

  private needsDebugObject(config: ControllerConfig) {
    return config.settings !== undefined && (config.settings.onChange || config.settings.onFinishChange);
  }
}

