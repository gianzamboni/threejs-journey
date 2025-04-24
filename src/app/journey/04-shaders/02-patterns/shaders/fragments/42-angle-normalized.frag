precision mediump float;

#define PI 3.14159265358979323846
varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  vec2 rotatedUv = rotate(vUv, uTime * 0.5, vec2(0.5, 0.5));
  float strength = atan(rotatedUv.x - 0.5, rotatedUv.y - 0.5) / (PI * 2.0) + 0.5;
  strength = 1.0 - strength;
  gl_FragColor = vec4(vec3(strength), 1.0);
}