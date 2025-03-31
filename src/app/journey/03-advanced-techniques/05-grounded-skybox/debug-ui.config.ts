

export const ENV_CONTROLLERS = [
  {
    propertyPath: "environmentIntensity",
    settings: {
      name: "Intensity",
      min: 0,
      max: 10,
      step: 0.1,
    }
  }, {
    propertyPath: "environmentRotation.y",
    settings: {
      name: "Rotation",
      min: 0,
      max: Math.PI * 2,
      step: 0.001,
    }
  } 
]