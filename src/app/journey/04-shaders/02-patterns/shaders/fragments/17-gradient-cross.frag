precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float verticalGradient = abs(vUv.x - 0.5) * displacedSin(uTime) * 100.0;
  float horizontalGradient = abs(vUv.y - 0.5) * displacedSin(uTime) * 100.0;
  float strength = min(verticalGradient, horizontalGradient);
  gl_FragColor = vec4(vec3(strength), 1.0);
}