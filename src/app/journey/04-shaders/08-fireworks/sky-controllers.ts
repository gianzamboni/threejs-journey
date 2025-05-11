import { ControllerConfig } from "#/app/decorators/customizable"

const COMMON_SETTINGS: ControllerConfig['settings'] = {
  onChange: 'updateSky'
}

export const SKY_CONTROLLERS = [
  {
    propertyPath: 'turbidity',
    settings: {
      ...COMMON_SETTINGS,
      min:  1,
      max: 20,
      step: 0.1,
    }
  },
  {
    propertyPath: 'rayleigh',
    settings: {
      ...COMMON_SETTINGS,
      min: 0,
      max: 4,
      step: 0.001,
    }
  },
  {
    propertyPath: 'mieCoefficient',
    settings: {
      ...COMMON_SETTINGS,
      min: 0,
      max: 0.1,
      step: 0.001,
    }
  },
  {
    propertyPath: 'mieDirectionalG',
    settings: {
      ...COMMON_SETTINGS,
      min: 0,
      max: 1,
      step: 0.001,
    }
  },
  {
    propertyPath: 'elevation',
    settings: {
      ...COMMON_SETTINGS,
      min: -3,
      max: 90,
      step: 0.1,
    }
  },
  {
    propertyPath: 'azimuth',
    settings: {
      ...COMMON_SETTINGS,
      min: -180,
      max: 180,
      step: 0.1,
    }
  },
  {
    propertyPath: 'exposure',
    settings: {
      ...COMMON_SETTINGS,
      min: 0,
      max: 1,
      step: 0.0001,
    }
  }
]