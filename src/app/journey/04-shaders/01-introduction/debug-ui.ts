import { ControllerConfig } from "#/app/decorators/customizable";

const frequencyConfig: ControllerConfig['settings'] = {
    min: 0,
    max: 20,
    step: 0.01,
}

export const MATERIAL_CONTROLLERS: ControllerConfig[] = [
  {
    propertyPath: 'uniforms.uFrequency.value.x',
    settings: {
      ...frequencyConfig,
      name: 'Frequency X',
    }
  },
  {
    propertyPath: 'uniforms.uFrequency.value.y',
    settings: {
      ...frequencyConfig,
      name: 'Frequency Y',
    }
  }
]