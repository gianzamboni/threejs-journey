import { ControllerConfig } from "@/app/decorators/customizable";
import { ExerciseMetadata } from "@/app/utils/exercise-metadata";
import { getPathArray, printable } from "@/app/utils/text-utils";
import GUI, { Controller } from "lil-gui";

/**
 * Represents an object and property name pair for controller binding
 */
type CustomizableData = {
  object: any;
  propertyName: string;
}

/**
 * Factory class for creating debug UI controllers for exercise properties
 */
export class ControllerFactory {
  private gui: GUI;
  private exercise: any;
  private debugObject: any;

  /**
   * Creates a new ControllerFactory instance
   * @param gui The GUI instance to add controllers to
   * @param exercise The exercise instance to create controllers for
   */
  public constructor(gui: GUI, exercise: any) {
    this.gui = gui;
    this.exercise = exercise;
    this.exercise._ControllerFactory_debugObject = {};
    this.debugObject = this.exercise._ControllerFactory_debugObject;
  }

  /**
   * Creates controllers for all customizable properties in the exercise
   */
  public create(): void {
    const controllersConfig = ExerciseMetadata.getControllers(this.exercise);
    for (const key in controllersConfig) {
      this.createControllers(key, controllersConfig[key]);
    }
  }

  /**
   * Creates controllers for a specific property
   * @param key The property key
   * @param controllersConfig The controller configurations
   */
  public createControllers(key: string, controllersConfig: ControllerConfig[]): void {
    for (const config of controllersConfig) {
      this.createController(key, config);
    }
  }

  /**
   * Creates a single controller for a property
   * @param key The property key
   * @param config The controller configuration
   */
  private createController(key: string, config: ControllerConfig): void {
    const folder = this.getFolder(config.folderPath);
    const customizableObject = this.findCustomizableObject(key, config);
    const isColor = config.type === 'color';
    
    // Create the controller
    const controller = folder[isColor ? 'addColor' : 'add'](
      customizableObject.object, 
      customizableObject.propertyName
    );

    // Apply controller settings
    this.applyControllerSettings(controller, config);
  }

  /**
   * Applies settings to a controller
   * @param controller The controller to apply settings to
   * @param config The controller configuration
   */
  private applyControllerSettings(controller: Controller, config: ControllerConfig): void {
    // Apply all settings from the config
    for (const [setting, value] of Object.entries(config.settings ?? {})) {
      if (setting === 'onChange' || setting === 'onFinishChange') {
        // Bind callback methods
        controller[setting as keyof Controller](this.exercise[value].bind(this.exercise));
      } else {
        // Apply other settings directly
        controller[setting as keyof Controller](value);
      }
    }

    // Set a default name if none was provided
    if (config.settings?.name === undefined) {
      controller.name(printable(controller.property));
    }
  }

  /**
   * Gets or creates a folder for a controller
   * @param folderPath The folder path
   * @returns The GUI folder
   */
  private getFolder(folderPath: string | undefined): GUI {
    if (this.gui === undefined) throw new Error('GUI not initialized');
    if (!folderPath) {
      return this.gui;
    }

    // Create nested folders if needed
    return folderPath.split('/').reduce((folder: GUI, folderName: string) => {
      const existingFolder = folder.folders.find(f => f._title === folderName);
      if (existingFolder) {
        return existingFolder;
      } else {
        return folder.addFolder(folderName);
      }
    }, this.gui);
  }

  /**
   * Finds the object and property name for a controller
   * @param key The property key
   * @param config The controller configuration
   * @returns The customizable data
   */
  private findCustomizableObject(key: string, config: ControllerConfig): CustomizableData {
    if (config.propertyPath === undefined || config.propertyPath.length === 0) {
      return { object: this.exercise, propertyName: key };
    }

    const path = getPathArray(config.propertyPath);
    path.unshift(key);
    const propertyName = path.pop() as string;

    const object = path.reduce((obj, property) => {
      return obj[property];
    }, this.exercise);

    // Use debug object for properties with callbacks
    if (this.needsDebugObject(config)) {
      return this.createDebugObject(key, config, object, propertyName);
    }
    
    return { object, propertyName };
  }

  /**
   * Creates a debug object for a property with callbacks
   * @param key The property key
   * @param config The controller configuration
   * @param object The object containing the property
   * @param propertyName The property name
   * @returns The customizable data
   */
  private createDebugObject(
    key: string, 
    config: ControllerConfig, 
    object: any, 
    propertyName: string
  ): CustomizableData {
    const propertyValue = object[propertyName] ?? config.initialValue;
    if (propertyValue === undefined) {
      throw new Error(`Customizable property ${config.propertyPath} should have an initial value`);
    }
    
    const debugKey = `${key}.${config.propertyPath}`;
    this.debugObject[debugKey] = propertyValue;
    
    return { 
      object: this.debugObject, 
      propertyName: debugKey 
    };
  }

  /**
   * Determines if a property needs a debug object
   * @param config The controller configuration
   * @returns True if the property needs a debug object
   */
  private needsDebugObject(config: ControllerConfig): boolean {
    return config.settings !== undefined && 
           (config.settings.onChange !== undefined || 
            config.settings.onFinishChange !== undefined);
  }
}