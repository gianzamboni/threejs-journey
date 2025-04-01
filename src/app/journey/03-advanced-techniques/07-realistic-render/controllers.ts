import { positionConfig } from '#/app/utils/light-controllers-utils';
import * as THREE from 'three';

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
    folderPath: 'Tone Mapping',
    settings: {
      name: 'Algorithm',
      options: {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
      }
    }
  }, {
    propertyPath: 'toneMappingExposure',
    folderPath: 'Tone Mapping',
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
    folderPath: 'Directional Light',
    settings: {
      name: 'Position',
      min: -10,
      max: 10,
      step: 0.001,
    },
  }), {
    propertyPath: 'castShadow',
    folderPath: 'Directional Light',
    settings: {
      name: 'Cast Shadow',
    }
  }]