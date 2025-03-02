import { ControllerConfig } from '#/app/decorators/customizable';
import { commonControllers, createPositionConfig, Lights, LightType, pointAndSpotCommonConfig, spotConfig } from '#/app/utils/light-controllers-utils';
import { printable } from '#/app/utils/text-utils';

const groundColorConfig: ControllerConfig = {
  propertyPath: 'hemisphere.groundColor',
  type: 'color',
  folderPath: 'Hemisphere',
  settings: {
    onChange: "updateGroundColor",
  }
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
  ...createPositionConfig('rectArea', { propertyName: 'lookAt', onChange: 'updateLookAt', initialValue: 0 })
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
const lightsWithHelpers: LightType[] = ['directional', 'point', 'rectArea', 'spot'];

const callbacks = {
  toggleLight: 'toggleLight',
  updateColor: 'updateColor',
}

export const LIGHTS_CONFIG: ControllerConfig[] = [
  ...allLightKeys.flatMap(lightType => commonControllers(lightType, { callbacks })),
  ...lightsWithPosition.flatMap(lightType => createPositionConfig(lightType, {  })),
  ...pointAndSpotLights.flatMap(lightType => pointAndSpotCommonConfig(lightType, {  })),
  groundColorConfig,
  ...reactAreaConfig,
  ...spotConfig({})
]

export const HELPERS_CONFIG: ControllerConfig[] = lightsWithHelpers.flatMap(lightType => helperConfig(lightType));