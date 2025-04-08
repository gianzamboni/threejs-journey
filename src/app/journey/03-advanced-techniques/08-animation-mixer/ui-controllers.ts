import { positionConfig } from "#/app/utils/light-controllers-utils";

export const ENV_MAP_CONTROLLERS = [{
  settings: {
    min: 0,
    max: 4,
    step: 0.001,
    onChange: 'updateAllMaterials'
  }
}];

export const LIGHT_CONTROLLERS = [{
  propertyPath: 'intensity',
  folderPath: 'Directional Light',
  settings: {
    name: 'Intensity',
    min: 0,
    max: 10,
    step: 0.001,
  }
},
  ...positionConfig({
    propertyPath: 'position',
    folderPath: 'Directional Light/Position',
    settings: {
      name: '',
      min: -5,
      max: 5,
      step: 0.001
    }
  })
];
