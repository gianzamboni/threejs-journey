uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uProgress;
attribute float aSize;
attribute float aTimeMultiplier;

// [newMin, newMax] -> [remapMin, remapMax]
float remap(float value, float remapMin, float remapMax, float min, float max) {
  return min + (value - remapMin) * (max - min) / (remapMax - remapMin);  
}

float explode(float progress) {
  float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 -pow(1.0 - explodingProgress, 1.5);
  return explodingProgress;
} 

float fall(float progress) {
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingProgress = clamp(fallingProgress, 0.0, 1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  return fallingProgress;
}

float size(float progress) {
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);
  return sizeProgress;
}

float twinkle(float progress) {
  float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
  float sizeTwinkle = sin(progress * 30.0) * 0.5 + 0.5;
  sizeTwinkle = 1.0 - sizeTwinkle * twinkleProgress;
  return sizeTwinkle;
}

void main() {

  float progress = uProgress * aTimeMultiplier;
  vec3 newPosition = position;

  float explodingProgress = explode(progress);
  newPosition *= explodingProgress;

  float fallingProgress = fall(progress);
  newPosition.y -= fallingProgress * 0.2;

  float sizeProgress = size(progress);
  float sizeTwinkle = twinkle(progress);

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;  

  gl_PointSize = uSize * aSize * uResolution.y * sizeProgress * sizeTwinkle;
  gl_PointSize *= 1.0 / -viewPosition.z;
  
  gl_Position = (gl_PointSize < 1.0) ? vec4(9999.) : projectionMatrix * viewPosition;
}