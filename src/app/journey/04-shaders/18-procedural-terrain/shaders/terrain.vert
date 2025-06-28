#include "../../../../utils/shaders/simplexNoise2d.glsl"

float getElevation(vec2 position) {
  float elevation = simplexNoise2d(position);
  return elevation;
}

void main() {
  float elevation = getElevation(csm_Position.xz);

  float shift = 0.01;
  vec3 positionA = csm_Position.xyz + vec3(shift, 0.0, 0.0);
  vec3 positionB = position.xyz + vec3(0.0, 0.0, -shift);

  positionA.y += getElevation(positionA.xz);
  positionB.y += getElevation(positionB.xz);

  vec3 toA = normalize(positionA - csm_Position.xyz);
  vec3 toB = normalize(positionB - csm_Position.xyz);
  csm_Normal = cross(toA, toB);

  csm_Position.y += elevation;
}