import { ControllerConfig } from "#/app/decorators/customizable";

export const INITIAL_COLORS = {
  uColorWaterDeep: '#002b3d',
  uColorWaterSurface: '#66a8ff',
  uColorSand: '#ffe894',
  uColorGrass: '#85d534',
  uColorRock: '#bfbd8d',
  uColorSnow: '#ffffff',
}

export const UNIFORM_CONTROLLERS: ControllerConfig[] = [
  {
    propertyPath: 'uPositionFrequency.value',
    settings: {
      min: 0,
      max: 1,
      step: 0.01,
      name: 'Position Frequency',
    }
  },
  {
    propertyPath: 'uStrength.value',
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: 'Strength',
    }
  },
  {
    propertyPath: 'uWarpFrequency.value',
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: 'Warp Frequency',
    }
  },
  {
    propertyPath: 'uWarpStrength.value',
    settings: {
      min: 0,
      max: 1,
      step: 0.001,
      name: 'Warp Strength',
    } 
  }, 
  {
    propertyPath: 'ColorWaterDeep',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorWaterDeep,
    settings: {
      name: 'Water Deep',
      onChange: 'updateUniform'
    }
  },
  {
    propertyPath: 'ColorWaterSurface',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorWaterSurface,
    settings: {
      name: 'Water Surface',
      onChange: 'updateUniform'
    }
  },
  {
    propertyPath: 'ColorSand',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorSand,
    settings: {
      name: 'Sand',
      onChange: 'updateUniform'
    }
  },
  {
    propertyPath: 'ColorGrass',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorGrass,
    settings: {
      name: 'Grass',
      onChange: 'updateUniform'
    }
  },
  {
    propertyPath: 'ColorRock',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorRock,
    settings: {
      name: 'Rock',
      onChange: 'updateUniform'
    }
  },
  {
    propertyPath: 'ColorSnow',
    type: 'color',
    initialValue: INITIAL_COLORS.uColorSnow,
    settings: {
      name: 'Snow',
      onChange: 'updateUniform'
    }
  } 
];