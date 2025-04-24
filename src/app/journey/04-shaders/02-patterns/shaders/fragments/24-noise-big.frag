precision mediump float;

varying vec2 vUv;

uniform float uTime;
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

#include '../utils.frag';

void main() {
  vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
  float strength = sin(random(gridUv ) * uTime * 6.25);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}