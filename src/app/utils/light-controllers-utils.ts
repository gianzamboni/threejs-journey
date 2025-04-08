import { 
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  RectAreaLight,
  SpotLight
} from 'three';

import { printable } from "./text-utils"

import { ControllerConfig } from '../decorators/customizable';

export type Lights = {
  ambient: AmbientLight,
  directional: DirectionalLight,
  hemisphere: HemisphereLight,
  point: PointLight,
  rectArea: RectAreaLight,
  spot: SpotLight
}

export type LightType = keyof Lights;

type FolderConfig = {
  folder?: string
}
type LightConfig<T> = T & FolderConfig;

export function commonControllers(lightType: keyof Lights, config: LightConfig<{
  callbacks: {
    toggleLight: string,
    updateColor: string,
  }
}>): ControllerConfig[] {
  const context = {
    lightType
  }

  const folderPath = config.folder ? `${config.folder}/${printable(lightType)}` : printable(lightType);
  return [
    {
      propertyPath: `${lightType}.onOff`,
      folderPath,
      initialValue: true,
      type: 'master',
      context,
      settings: {
        name: "On/Off",
        onChange: config.callbacks.toggleLight,
      }
    },
    {
      propertyPath: `${lightType}.color`,
      type: 'color',
      folderPath,
      context,
      settings: {
        onChange: config.callbacks.updateColor,
      }
    },
    {
      propertyPath: `${lightType}.intensity`,
      folderPath,
      context,
      settings: {
        min: 0,
        max: 6,
        step: 0.01
      }
    }
  ]
}

export function positionConfig(config: ControllerConfig): ControllerConfig[] {
  return ['x', 'y', 'z'].map(axis => {
    return {
      ...config,
      propertyPath: `${config.propertyPath}.${axis}`,
      settings: {
        ...config.settings,
        name: `${config.settings?.name} ${printable(axis)}`
      }
    }
  })
}
export function createPositionConfig(lightType: keyof Lights, config: LightConfig<{
  propertyName?: string,
  onChange?: string,
  initialValue?: number
}>): ControllerConfig[] {
  const property = config.propertyName ?? 'position';
  const folderPath = config.folder ? `${config.folder}/${printable(lightType)}` : printable(lightType);
  return positionConfig({
    propertyPath: `${lightType}.${property}`,
    folderPath: `${folderPath}/${printable(property)}`,
    initialValue: config.initialValue,
    settings: {
      min: -5,
      max: 5,
      step: 0.001,
      onChange: config.onChange,
      name: printable(property)
    }
  })
}


export function pointAndSpotCommonConfig(lightType: keyof Lights, config?: FolderConfig): ControllerConfig[] {
  const folderPath = config?.folder ? `${config.folder}/${printable(lightType)}` : printable(lightType);
  return [
    {
      propertyPath: `${lightType}.distance`,
      folderPath,
      settings: {
        min: 0,
        max: 10,
        step: 0.01
      }
    }, 
    {
      propertyPath: `${lightType}.decay`,
      folderPath,
      settings: {
        min: 0,
        max: 2,
        step: 0.01
      }
    }
  ]
}

export function spotConfig(config: FolderConfig): ControllerConfig[] {
  const folderPath = config?.folder ? `${config.folder}/Spot` : 'Spot';
  return [
    {
      propertyPath: 'spot.angle',
      folderPath,
      settings: {
      min: 0,
      max: Math.PI * 0.5,
      step: 0.01
    }
  },
  {
      propertyPath: 'spot.penumbra',
      folderPath,
      settings: {
        min: 0,
        max: 1,
        step: 0.01
      }
    },
    ...createPositionConfig('spot', { folder: config.folder, propertyName: 'target.position' })
  ]
}