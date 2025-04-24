precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float strength = bar(vUv.y, 0.5);
  vec3 color = horizontalSweep(vUv, uTime, strength);
  gl_FragColor = vec4(color, 1.0);
}
