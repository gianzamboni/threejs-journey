precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

void main() {
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  float strength = sin(angle * 100.0);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}