
const ENVIROMENT_FOLDER = "Environment";
const BACKGROUND_FOLDER = "Background";

export const ENV_CONTROLLERS = [
  {
    folderPath: ENVIROMENT_FOLDER,
    propertyPath: "environmentIntensity",
    settings: {
      name: "Intensity",
      min: 0,
      max: 10,
      step: 0.1,
    }
  },
  {
    folderPath: BACKGROUND_FOLDER,
    propertyPath: "backgroundBlurriness",
    settings: {
      name: "Blurriness",
      min: 0,
      max: 1,
      step: 0.001,
    }
  },
  {
    folderPath: BACKGROUND_FOLDER,
    propertyPath: "backgroundIntensity",
    settings: {
      name: "Intensity",
      min: 0,
      max: 10,
      step: 0.1,
    }
  }, {
    folderPath: BACKGROUND_FOLDER,
    propertyPath: "backgroundRotation.y",
    settings: {
      name: "Rotation",
      min: 0,
      max: Math.PI * 2,
      step: 0.001,
    }
  }, {
    folderPath: ENVIROMENT_FOLDER,
    propertyPath: "environmentRotation.y",
    settings: {
      name: "Rotation",
      min: 0,
      max: Math.PI * 2,
      step: 0.001,
    }
  } 
]
