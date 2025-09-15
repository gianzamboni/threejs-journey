import { ControllerConfig } from '#/app/decorators/customizable';

const MATERIAL_FOLDER = 'Material';
const DEFAULT_SETTINGS = {
  min: 0,
  max: 1,
  step: 0.0001,
}
/**
 * Configuration objects for the MeshPhysicalMaterial properties
 * These are used with the Customizable decorator to create UI controls
 */
export const PHYSICAL_MATERIAL_CONFIGS: ControllerConfig[] = [
  {
    propertyPath: 'material.metalness',
    folderPath: MATERIAL_FOLDER,
    settings: DEFAULT_SETTINGS
  }, 
  {
    propertyPath: 'material.roughness',
    folderPath: MATERIAL_FOLDER,
    settings: DEFAULT_SETTINGS
  }, 
  {
    propertyPath: 'material.transmission',
    folderPath: MATERIAL_FOLDER,
    settings: DEFAULT_SETTINGS
  }, 
  {
    propertyPath: 'material.ior',
    folderPath: MATERIAL_FOLDER,
    settings: {
      min: 1,
      max: 2.5,
      step: 0.0001,
      name: 'IOR'
    }
  }, 
  {
    propertyPath: 'material.thickness',
    folderPath: MATERIAL_FOLDER,      
    settings: DEFAULT_SETTINGS
  }
];