precision mediump float;

varying vec2 vUv;

#include '../utils.frag';
float steppedGradient(float axis) {
  return floor(axis * 10.0) / 10.0;
}

void main() {
  float strength = steppedGradient(vUv.x) * steppedGradient(vUv.y);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}