import { AdditiveBlending, MultiplyBlending, NoBlending, NormalBlending, SubtractiveBlending } from "three"

import { ControllerConfig } from "#/app/decorators/customizable"

import { SEA_CONTROLS } from "../../common/sea/controllers"

export const RAGING_SEA_CONTROLS_V2: ControllerConfig[] = [
  ...SEA_CONTROLS,
  {
    propertyPath: "blending",
    folderPath: "Sea",
    settings: {
      options: {
        "No": NoBlending,
        "Additive": AdditiveBlending,
        "Normal": NormalBlending,
        "Subtractive": SubtractiveBlending,
        "Multiply": MultiplyBlending
      },
      name: "Blending",
    }
  }]

export const RAGING_SEA_COLORS_CONTROLS_V2: ControllerConfig[] = [{
  folderPath: "Sea",
  type: "color",
  settings: {
    onChange: 'updateSeaColor',
    name: "Color",
  }
}]