import { ControllerConfig } from "#/app/decorators/customizable";

function commonSetting(name: string, max: number): ControllerConfig {
  return {
    propertyPath: `material.${name}`,
    folderPath: "Material",
    settings: {
      name,
      min: 0,
      max,
      step: 0.001,
    }
  }
}

export const MATERIAL_CONTROLLERS: ControllerConfig[] = [
  commonSetting("metalness", 1),
  commonSetting("roughness", 1),
  commonSetting("transmission", 1),
  commonSetting("ior", 10),
  commonSetting("thickness", 10),
  {
    propertyPath: "material.color",
    folderPath: "Material",
    type: "color",
    settings: {
      name: "Color",
      onChange: "updateMatetrialColor"
    }
  }]

function animationSetting(name: string, max: number): ControllerConfig {
  return {
    propertyPath: `${name}.value`,
    folderPath: "Animation",
    settings: {
      name,
      min: 0,
      max,
      step: 0.001,
    }
  }
}

export const ANIMATION_CONTROLLERS: ControllerConfig[] = [
  animationSetting("uPositionFrequency", 2),
  animationSetting("uTimeFrequency", 2),
  animationSetting("uStrength", 2),
  animationSetting("uWarpPositionFrequency", 2),
  animationSetting("uWarpTimeFrequency", 2),
  animationSetting("uWarpStrength", 2),
  {
    propertyPath: "uColorA.value",
    folderPath: "Animation",
    type: "color",
    settings: {
      name: "Color A",
      onChange: "updateColorA"
    }
  },
  {
    propertyPath: "uColorB.value",
    folderPath: "Animation",
    type: "color",
    settings: {
      name: "Color B",
      onChange: "updateColorB"
    }
  }
]