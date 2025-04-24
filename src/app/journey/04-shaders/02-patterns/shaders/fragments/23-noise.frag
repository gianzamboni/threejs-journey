precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float strength = random(vUv * sin(uTime * 2.0));
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}