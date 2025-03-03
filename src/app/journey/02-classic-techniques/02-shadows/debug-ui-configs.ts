import { ControllerConfig } from "#/app/decorators/customizable";
import { commonControllers, createPositionConfig, LightType, pointAndSpotCommonConfig, spotConfig } from "#/app/utils/light-controllers-utils";

const folder = 'Lights';
const callbacks = {
  toggleLight: 'toggleLight',
  updateColor: 'updateColor',
}

const allLightKeys: LightType[] = ['ambient', 'directional', 'spot', 'point'];
const lightKeysWithPosition: LightType[] = ['directional', 'spot', 'point'];
const pointAndSpotLightKeys: LightType[] = ['spot', 'point'];

export const LIGHTS_CONFIG: ControllerConfig[] = [
  ...allLightKeys.flatMap(lightType => commonControllers(lightType, {folder, callbacks})),
  ...lightKeysWithPosition.flatMap(lightType => createPositionConfig(lightType, {folder})),
  ...pointAndSpotLightKeys.flatMap(lightType => pointAndSpotCommonConfig(lightType, {folder})),
  ...spotConfig({folder})
]

const materialConfigs = {
  min: 0,
  max: 1,
  step: 0.001,
}
export const MATERIAL_CONFIG: ControllerConfig[] = [
  {
    propertyPath: 'roughness',
    folderPath: "Material",
    settings: materialConfigs
  }, {
    propertyPath: 'metalness',
    folderPath: "Material",
    settings: materialConfigs
  }
]