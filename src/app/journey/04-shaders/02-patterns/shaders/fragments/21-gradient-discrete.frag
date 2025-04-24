precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float strength = floor(vUv.x * 10.0) / 10.0;
  vec3 color = applyColor(vec2(vUv.x, 0), strength);
  gl_FragColor = vec4(color, 1.0);
}

