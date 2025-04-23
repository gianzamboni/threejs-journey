precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

void main() {
  float strength = distance(vUv, vec2(0.5));
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}