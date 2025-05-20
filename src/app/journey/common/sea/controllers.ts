import { ControllerConfig } from "#/app/decorators/customizable";

export const SEA_CONTROLS: ControllerConfig[] = [
  {
    propertyPath: "uniforms.uBigWavesElevation.value",
    folderPath: "Big Waves",
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: "Elevation",
    }
  }, {
    propertyPath: "uniforms.uBigWavesFrequency.value.x",
    folderPath: "Big Waves",
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: "Frequency X",
    }
  }, {
    propertyPath: "uniforms.uBigWavesFrequency.value.y",
    folderPath: "Big Waves",
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: "Frequency Y",
    }
  }, {
    propertyPath: "uniforms.uBigWavesSpeed.value",
    folderPath: "Big Waves",
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: "Speed",
    }
  },  {
    propertyPath: "uniforms.uSmallWavesElevation.value",
    folderPath: "Small Waves",
    settings: {
      min: 0,
      max: 1,
      step: 0.001,
      name: "Elevation",
    }
  }, {
    propertyPath: "uniforms.uSmallWavesFrequency.value",
    folderPath: "Small Waves",
    settings: {
      min: 0,
      max: 30,
      step: 0.001,
      name: "Frequency",
    }
  }, {
    propertyPath: "uniforms.uSmallWavesSpeed.value",
    folderPath: "Small Waves",
    settings: {
      min: 0,
      max: 4,
      step: 0.001,
      name: "Speed",
    }
  }, {
    propertyPath: "uniforms.uSmallIterations.value",
    folderPath: "Small Waves",
    settings: {
      min: 0,
      max: 5,
      step: 1,
      name: "Iterations",
    }
  }
]