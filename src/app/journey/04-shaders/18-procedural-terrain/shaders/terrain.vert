#include "../../../../utils/shaders/simplexNoise2d.glsl"

float getElevation(vec2 position) {
  float elevation = simplexNoise2d(position);
  return elevation;
}

void main() {
  float elevation = getElevation(csm_Position.xz);
  csm_Position.y += elevation;
}