import { ControllerConfig } from "#/app/decorators/customizable"

import { SEA_CONTROLS } from "../../common/sea/controllers"

export const RAGING_SEA_CONTROLS: ControllerConfig[] = [
  ...SEA_CONTROLS,
  {
    propertyPath: "uniforms.uColorOffset.value",
    folderPath: "Colors",
    settings: {
      min: 0,
      max: 1,
      step: 0.001,
      name: "Offset",
    }
  }, {
    propertyPath: "uniforms.uColorMultiplier.value",
    folderPath: "Colors",
    settings: {
      min: 0,
      max: 10,
      step: 0.001,
      name: "Multiplier",
    }
  }
]

export const RAGING_SEA_COLORS_CONTROLS: ControllerConfig[] = [{
  propertyPath: "depth",
  folderPath: "Colors",
  type: "color",
  settings: {
    onChange: "onDepthColorChange",
    name: "Depth",
  }
}, {
  propertyPath: "surface",
  folderPath: "Colors",
  type: "color",
  settings: {
    onChange: "onSurfaceColorChange",
    name: "Surface",
  }
}]