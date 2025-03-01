import { ControllerConfig } from '@/app/decorators/customizable';
import { Lights } from './types';
import { printable } from '@/app/utils/text-utils';


function commonControllers(lightType: keyof Lights): ControllerConfig[] {
  return [
    {
      propertyPath: `${lightType}.onOff`,
      folderPath: printable(lightType),
      initialValue: true,
      type: 'master',
      context: lightType,
      settings: {
        name: "On/Off",
        onChange: "toggleLight",
      }
    },
    {
      propertyPath: `${lightType}.color`,
      type: 'color',
      folderPath: printable(lightType),
      context: lightType,
      settings: {
        onChange: "updateColor",
        name: "Color"
      }
    },
    {
      propertyPath: `${lightType}.intensity`,
      folderPath: printable(lightType),
      context: lightType,
      settings: {
        min: 0,
        max: 6,
        step: 0.01
      }
    }
  ]
}

const allLightKeys: (keyof Lights)[] = ['ambient', 'directional', 'hemisphere', 'point', 'rectArea', 'spot'];

export const LIGHTS_CONFIG: ControllerConfig[] = [
  ...allLightKeys.flatMap(lightType => commonControllers(lightType)),
]

export const HELPERS_CONFIG: ControllerConfig[] = [];
// const POSITION_CONFIG = {
//   min: -5,
//   max: 5,
//   step: 0.001
// };

// const SIZE_CONFIG = {
//   min: 0.1,
//   max: 5,
//   step: 0.01
// };

// /**
//  * Creates position configuration for x, y, z axes
//  */
// function createPositionConfig(propertyName: string, onChange?: string, initialValue?: number): ControllerConfig[] {
//   return ['x', 'y', 'z'].map(axis => {
//     const controller: ControllerConfig = {
//       propertyPath: `${propertyName}.${axis}`,
//       folderPath: propertyName,
//       settings: { ...POSITION_CONFIG }
//     };

//     if (onChange) {
//       controller.settings!.onChange = onChange;
//     }
//     if (initialValue !== undefined) {
//       controller.initialValue = initialValue;
//     }
//     return controller;
//   });
// }


// const POSITIONAL_LIGHT_CONFIGS: ControllerConfig[] = ['point', 'rectArea', 'spot'].flatMap(lightType => createPositionConfig(`${lightType}.position`));


// export const DIRECTIONAL_LIGHT_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
//   ...createPositionConfig('position')
// ];

// /**
//  * Configuration for hemisphere light
//  */
// export const HEMISPHERE_LIGHT_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
//   {
//     propertyPath: "groundColor",
//     type: 'color',
//     settings: {
//       onChange: "updateGroundColor"
//     }
//   }
// ];

// /**
//  * Configuration for point light
//  */
// export const POINT_LIGHT_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
//   ...createPositionConfig('position'),
//   {
//     propertyPath: "distance",
//     settings: {
//       min: 0,
//       max: 10,
//       step: 0.01
//     }
//   },
//   {
//     propertyPath: "decay",
//     settings: {
//       min: 0,
//       max: 2,
//       step: 0.01
//     }
//   }
// ];

// /**
//  * Configuration for rect area light
//  */
// export const RECT_AREA_LIGHT_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
//   ...createPositionConfig('position'),
//   {
//     propertyPath: "width",
//     settings: SIZE_CONFIG
//   },
//   {
//     propertyPath: "height",
//     settings: SIZE_CONFIG
//   },
//   ...createPositionConfig('lookAt', 'updateLookAt', 0)
// ];

// /**
//  * Configuration for spot light
//  */
// export const SPOT_LIGHT_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
//   ...createPositionConfig('position'),
//   {
//     propertyPath: "angle",
//     settings: {
//       min: 0,
//       max: Math.PI * 0.5,
//       step: 0.01
//     }
//   },
//   {
//     propertyPath: "penumbra",
//     settings: {
//       min: 0,
//       max: 1,
//       step: 0.01
//     }
//   },
//   ...createPositionConfig('target.position')
// ];

// /**
//  * Configuration for light helpers
//  */
// export const LIGHT_HELPER_CONFIGS: ControllerConfig[] = [
//   {
//     propertyPath: "visible",
//     initialValue: true,
//     settings: {
//       name: "Show helper"
//     }
//   }
// ];

// export const LIGHTS_CONFIGS: ControllerConfig[] = [
//   ...COMMON_LIGHT_CONFIGS,
// ]
//   'ambient': COMMON_LIGHT_CONFIGS,
//   'directional': DIRECTIONAL_LIGHT_CONFIGS,
//   'hemisphere': HEMISPHERE_LIGHT_CONFIGS,
//   'point': POINT_LIGHT_CONFIGS,
//   'rectArea': RECT_AREA_LIGHT_CONFIGS,
//   'spot': SPOT_LIGHT_CONFIGS
// };

// /**
//  * Helper configurations for the LightsExercise class
//  */
// export const HELPER_CONFIGS: ControllerConfig[] = [
//   ...LIGHT_HELPER_CONFIGS,
//   ...LIGHT_HELPER_CONFIGS,
//   ...LIGHT_HELPER_CONFIGS,
//   ...LIGHT_HELPER_CONFIGS
// ]; 

