import { ControllerConfig } from '@/app/decorators/customizable';
import { Lights, LightType, LightTypeHelper } from './types';
import { printable } from '@/app/utils/text-utils';


function commonControllers(lightType: keyof Lights): ControllerConfig[] {
  const context = {
    lightType
  }
  return [
    {
      propertyPath: `${lightType}.onOff`,
      folderPath: printable(lightType),
      initialValue: true,
      type: 'master',
      context,
      settings: {
        name: "On/Off",
        onChange: "toggleLight",
      }
    },
    {
      propertyPath: `${lightType}.color`,
      type: 'color',
      folderPath: printable(lightType),
      context,
      settings: {
        onChange: "updateColor",
      }
    },
    {
      propertyPath: `${lightType}.intensity`,
      folderPath: printable(lightType),
      context,
      settings: {
        min: 0,
        max: 6,
        step: 0.01
      }
    }
  ]
}

function createPositionConfig(lightType: keyof Lights, propertyName?: string, onChange?: string, initialValue?: number): ControllerConfig[] {
  const property = propertyName ?? 'position';
  return ['x', 'y', 'z'].map(axis => {
    const controller: ControllerConfig = {
      propertyPath: `${lightType}.${property}.${axis}`,
      folderPath: `${printable(lightType)}/${printable(property)}`,
      settings: {
        min: -5,
        max: 5,
        step: 0.001,
        name: `${printable(axis)}`
      }
    };
    if (onChange) {
      controller.settings!.onChange = onChange;
    }
    if (initialValue !== undefined) {
      controller.initialValue = initialValue;
    }
    return controller;
  });
}

const groundColorConfig: ControllerConfig = {
  propertyPath: 'hemisphere.groundColor',
  type: 'color',
  folderPath: 'Hemisphere',
  settings: {
    onChange: "updateGroundColor",
  }
}

function pointAndSpotCommonConfig(lightType: keyof Lights): ControllerConfig[] {
  return [
    {
      propertyPath: `${lightType}.distance`,
      folderPath: `${printable(lightType)}`,
      settings: {
        min: 0,
        max: 10,
        step: 0.01
      }
    }, 
    {
      propertyPath: `${lightType}.decay`,
      folderPath: `${printable(lightType)}`,
      settings: {
        min: 0,
        max: 2,
        step: 0.01
      }
    }
  ]
}

const reactAreaConfig: ControllerConfig[] = [
  ...['width', 'height'].map(size => ({
    propertyPath: `rectArea.${size}`,
    folderPath: 'Rect Area',
    settings: {
      min: 0,
      max: 5,
    }
  })),
  ...createPositionConfig('rectArea', 'lookAt', 'updateLookAt', 0)
]

const spotConfig: ControllerConfig[] = [
  {
    propertyPath: 'spot.angle',
    folderPath: 'Spot',
    settings: {
      min: 0,
      max: Math.PI * 0.5,
      step: 0.01
    }
  },
  {
    propertyPath: 'spot.penumbra',
    folderPath: 'Spot',
    settings: {
      min: 0,
      max: 1,
      step: 0.01
    }
  },
  ...createPositionConfig('spot', 'target.position')
]

function helperConfig(lightType: keyof Lights): ControllerConfig[] {
  return [
    {
      propertyPath: `${lightType}.visible`,
      folderPath: printable(lightType),
      initialValue: true,
      settings: {
        name: "Show helper"
      }
    }
  ]
}

const allLightKeys: LightType[] = ['ambient', 'directional', 'hemisphere', 'point', 'rectArea', 'spot'];
const lightsWithPosition: LightType[] = ['directional', 'point', 'rectArea', 'spot'];
const pointAndSpotLights: LightType[] = ['point', 'spot'];
const lightsWithHelpers: LightTypeHelper[] = ['directional', 'point', 'rectArea', 'spot'];

export const LIGHTS_CONFIG: ControllerConfig[] = [
  ...allLightKeys.flatMap(lightType => commonControllers(lightType)),
  ...lightsWithPosition.flatMap(lightType => createPositionConfig(lightType)),
  ...pointAndSpotLights.flatMap(lightType => pointAndSpotCommonConfig(lightType)),
  groundColorConfig,
  ...reactAreaConfig,
  ...spotConfig
]

export const HELPERS_CONFIG: ControllerConfig[] = lightsWithHelpers.flatMap(lightType => helperConfig(lightType));