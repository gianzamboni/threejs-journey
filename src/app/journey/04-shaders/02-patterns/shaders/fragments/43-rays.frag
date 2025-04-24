precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  vec2 rotatedUv = rotate(vUv, uTime * 0.5, vec2(0.5, 0.5));
  float angle = atan(rotatedUv.x - 0.5, rotatedUv.y - 0.5) / (PI * 2.0) + 0.5;
  float strength = mod(angle * 20.0, 1.0);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}