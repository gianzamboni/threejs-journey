import { ControllerConfig } from "@/app/decorators/customizable";

export const DEBUG_UI_CUBE_CONFIG: ControllerConfig[] = [{
  propertyPath: 'position.y',
  folderPath: 'Awesome Cube',
  settings: {
    min: -3,
    max: 3,
    step: 0.01,
    name: 'Elevation',
  }
},{
  propertyPath: 'visible', 
  folderPath: 'Awesome Cube',
}];

export const DEBUG_UI_MATERIAL_CONFIG: ControllerConfig[] = [{
  propertyPath: 'wireframe',
  folderPath: 'Awesome Cube',
}, {
  propertyPath: 'color',
  type: 'color',
  folderPath: 'Awesome Cube',
  settings: {
    onChange: 'updateMaterialColor'
  }
}];

export const DEBUG_UI_GEOMETRY_CONFIG: ControllerConfig[] = [{
  propertyPath: 'subdivisions',
  initialValue: 1,
  folderPath: 'Awesome Cube',
  settings: {
    min: 1,
    max: 20,
    step: 1,
    onFinishChange: 'updateSubdivisions',
    name: 'Subdivisions'
  }
}];