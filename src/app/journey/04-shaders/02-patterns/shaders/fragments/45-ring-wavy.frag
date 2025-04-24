precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  float radius = 0.25 + sin(angle * 100.0) * 0.02 * sin(uTime * 5.0);
  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}