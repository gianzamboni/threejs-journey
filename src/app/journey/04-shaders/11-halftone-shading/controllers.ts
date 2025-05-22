import { ControllerConfig } from "#/app/decorators/customizable";

export const INITIAL_COLOR = "#ff794d";
export const INITIAL_CLEAR_COLOR = "#26132f";
export const INITIAL_SHADOW_REPETITIONS = 100;
export const INITIAL_SHADOW_COLOR = "#8e19b8";
export const INITIAL_LIGHT_COLOR = "#ff794d";
export const INITIAL_LIGHT_REPETITIONS = 130;

export const HALFTONE_SHADING_CONTROLLER: ControllerConfig[] = [{
  type: "color",
  folderPath: "Main Halftone",
  initialValue: INITIAL_COLOR,
  propertyPath: "uColor",
  settings: {
    name: "Color",
    onChange: 'updateUniform'
  }
},{
  type: "color",
  initialValue: INITIAL_SHADOW_COLOR,
  folderPath: "Main Halftone",
  propertyPath: "uShadowColor",
  settings: {
    name: "Shadow Color",
    onChange: 'updateUniform'
  }
}, {
  initialValue: INITIAL_SHADOW_REPETITIONS,
  folderPath: "Main Halftone",
  propertyPath: "uniforms.uShadowRepetitions.value",
  settings: {
    name: "Shadow Repetitions",
    min: 0,
    max: 300,
    step: 1,
  }
}, {
  type: "color",
  folderPath: "Secondary Halftone",
  initialValue: INITIAL_LIGHT_COLOR,
  propertyPath: "uLightColor",
  settings: {
    name: "Color",
    onChange: 'updateUniform'
  }
}, {
  initialValue: INITIAL_LIGHT_REPETITIONS,
  folderPath: "Secondary Halftone",
  propertyPath: "uniforms.uLightRepetitions.value",
  settings: {
    name: "Repetitions",
    min: 0,
    max: 300,
    step: 1,
  }
}];