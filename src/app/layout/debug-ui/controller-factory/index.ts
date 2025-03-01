import { ControllerConfig } from "#/app/decorators/customizable";
import { ExerciseMetadata } from "#/app/utils/exercise-metadata";
import { getPathArray, printable } from "#/app/utils/text-utils";
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
      for(const config of controllersConfig[key]) {
        const folder = this.getFolder(config.folderPath);
        const customizableObject = this.findCustomizableObject(key, config);
        const isColor = config.type === 'color';
        const isMaster = config.type === 'master';
        
        // Create the controller
        const controller = folder[isColor ? 'addColor' : 'add'](
          customizableObject.object, 
          customizableObject.propertyName
        );
    
        // Apply controller settings
        this.applyControllerSettings(controller, config);
        
        // Add masters controller functionality if needed. That is, enable/disable other controllers of the same folder
        this.masterControllerSetup(folder, controller, isMaster);
        
        // Close all folders after all controllers are created
        this.gui.folders.forEach(f => f.close());
      }
    }
  }

  /**
   * Tracks a controller for master functionality
   * @param folder The folder containing the controller
   * @param controller The controller to track
   * @param isMaster Whether the controller is a master controller
   */
  private masterControllerSetup(folder: GUI, controller: Controller, isMaster: boolean): void {
    if(!isMaster) return;

    const onChange = controller._onChange;
    controller.onChange((value: any) => {
      // Call the onChange callback if it exists
      if(onChange) onChange(value);

      // Enable/disable other controllers in the same folder
      folder.controllersRecursive().forEach(slaveController => {
        if(slaveController === controller) return;
        slaveController.enable(value);
      });
    })
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
        controller[setting as keyof Controller]((newValue: any) => {
          this.exercise[value].bind(this.exercise)(newValue, {
            ...config.context,
            target: controller.object
          });
        });
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
      // We pass the path without the property name
      return this.createDebugObject(path, config, object, propertyName);
    }
    
    return { object, propertyName };
  }

  /**
   * Creates a debug object for a property with callbacks
   * @param path The path array to the property
   * @param config The controller configuration
   * @param object The object containing the property
   * @param propertyName The property name
   * @returns The customizable data
   */
  private createDebugObject(
    path: string[], 
    config: ControllerConfig, 
    object: any, 
    propertyName: string
  ): CustomizableData {
    const propertyValue = object[propertyName] ?? config.initialValue;
    if (propertyValue === undefined) {
      throw new Error(`Customizable property ${config.propertyPath} should have an initial value`);
    }
    
    // Navigate through the path and create objects as needed
    let current = this.debugObject;
    // We iterate through all path segments to create the nested structure
    for (const segment of path) {
      if (!current[segment]) {
        current[segment] = {};
      }
      current = current[segment];
    }
    
    // Set the value at the property name
    current[propertyName] = propertyValue;
    
    return { 
      object: current, 
      propertyName: propertyName 
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