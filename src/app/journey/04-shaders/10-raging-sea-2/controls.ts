import { ControllerConfig } from "#/app/decorators/customizable"

export const RAGING_SEA_CONTROLS: ControllerConfig[] = [{
  propertyPath: "uniforms.uBigWavesElevation.value",
  folderPath: "Sea/Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Elevation",
  }
}, {
  propertyPath: "uniforms.uBigWavesFrequency.value.x",
  folderPath: "Sea/Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Frequency X",
  }
}, {
  propertyPath: "uniforms.uBigWavesFrequency.value.y",
  folderPath: "Sea/Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Frequency Y",
  }
}, {
  propertyPath: "uniforms.uBigWavesSpeed.value",
  folderPath: "Sea/Big Waves",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Speed",
  }
}, {
  propertyPath: "uniforms.uColorOffset.value",
  folderPath: "Sea/Colors",
  settings: {
    min: 0,
    max: 1,
    step: 0.001,
    name: "Offset",
  }
}, {
  propertyPath: "uniforms.uColorMultiplier.value",
  folderPath: "Sea/Colors",
  settings: {
    min: 0,
    max: 10,
    step: 0.001,
    name: "Multiplier",
  } 
}, {
  propertyPath: "uniforms.uSmallWavesElevation.value",
  folderPath: "Sea/Small Waves",
  settings: {
    min: 0,
    max: 1,
    step: 0.001,
    name: "Elevation",
  }
}, {
  propertyPath: "uniforms.uSmallWavesFrequency.value",
  folderPath: "Sea/Small Waves",
  settings: {
    min: 0,
    max: 30,
    step: 0.001,
    name: "Frequency",
  }
}, {
  propertyPath: "uniforms.uSmallWavesSpeed.value",
  folderPath: "Sea/Small Waves",
  settings: {
    min: 0,
    max: 4,
    step: 0.001,
    name: "Speed",
  }
}, {
  propertyPath: "uniforms.uSmallIterations.value",  
  folderPath: "Sea/Small Waves",
  settings: {
    min: 0,
    max: 5,
    step: 1,
    name: "Iterations",
  }
}]

export const RAGING_SEA_COLORS_CONTROLS: ControllerConfig[] = [{
  propertyPath: "depth",
  folderPath: "Sea/Colors",
  type: "color",
  settings: {
    onChange: "onDepthColorChange",
    name: "Depth",
  }
}, {
  propertyPath: "surface",
  folderPath: "Sea/Colors",
  type: "color",
  settings: {
    onChange: "onSurfaceColorChange",
    name: "Surface",
  }
}]