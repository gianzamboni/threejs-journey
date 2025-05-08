import { ControllerConfig } from '#/app/decorators/customizable';

function config(property: string, settings: ControllerConfig['settings'], type?: ControllerConfig['type']) {
  const config: ControllerConfig = {
    folderPath: 'Galaxy',
    propertyPath: property,
    context: {
      property: property
    },
    settings: {
      ...settings,
      onChange: 'updateGalaxySettings'
    }
  }

  if (type) {
    config.type = type;
  }

  return config;
}

export function galaxyControllers(minSize: number, maxSize: number): ControllerConfig[] {
  return [
    config('count', {
      min: 100,
      max: 1000000,
      step: 100,
      name: 'Particle Count',
    }),
    config('size', {
      min: minSize,
      max: maxSize,
      step: 0.001,
      name: 'Particle Size',
    }),
    config('radius', {
      min: 1,
      max: 10,
      step: 0.1,
      name: 'Galaxy Radius',
    }),
    config('branches', {
      min: 2,
      max: 20,
      step: 1,
      name: 'Number of Branches',
    }),
    config('spin', {
      min: -5,
      max: 5,
      step: 0.001,
      name: 'Spin',
    }),
    config('randomness', {
      min: 0,
      max: 2,
      step: 0.001,
      name: 'Randomness',
    }),
    config('randomnessPower', {
      min: 1,
      max: 10,
      step: 0.001,
      name: 'Randomness Power',
    }),
    config('insideColor', {
      name: 'Inside Color',
    }, 'color'),
    config('outsideColor', {
      name: 'Outside Color',
    }, 'color'),
  ];
}