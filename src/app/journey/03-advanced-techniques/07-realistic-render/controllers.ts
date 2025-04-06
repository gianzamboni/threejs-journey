import { 
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping
} from 'three';

import { positionConfig } from '#/app/utils/light-controllers-utils';

const TONE_MAPPING_FOLDER = 'Tone Mapping';
const SHADOW_FOLDER = 'Directional Light';

export const SCENE_CONTROLLERS = [
  {
    propertyPath: 'environmentIntensity',
    folderPath: 'Environment',
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: 'Intensity',
    }
  }
]

export const RENDERER_CONTROLLERS = [
  {
    propertyPath: 'toneMapping',
    folderPath: TONE_MAPPING_FOLDER,
    settings: {
      name: 'Algorithm',
      options: {
        No: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping
      }
    }
  }, {
    propertyPath: 'toneMappingExposure',
    folderPath: TONE_MAPPING_FOLDER,
    settings: {
      name: 'Exposure',
      min: 0,
      max: 10,
      step: 0.001,
    }
  }
]


export const LIGHT_CONTROLLERS = [
  ...positionConfig({
    propertyPath: 'position',
    folderPath: SHADOW_FOLDER,
    settings: {
      name: 'Position',
      min: -10,
      max: 10,
      step: 0.001,
    },
  }), {
    propertyPath: 'castShadow',
    folderPath: SHADOW_FOLDER,
    settings: {
      name: 'Cast Shadow',
    }
  }, {
    propertyPath: 'shadow.normalBias',
    folderPath: SHADOW_FOLDER,
    settings: {
      name: 'Normal Bias',
      min: -0.05,
      max: 0.05,
      step: 0.001,
    }
  },{
    propertyPath: 'shadow.bias',
    folderPath: SHADOW_FOLDER,
    settings: {
      name: 'Bias',
      min: -0.05,
      max: 0.05,
    }
  }]