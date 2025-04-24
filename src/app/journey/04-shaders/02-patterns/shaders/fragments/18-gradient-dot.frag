precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float verticalGradient = abs(vUv.x - 0.5) * displacedSin(uTime) * 2.0;
  float horizontalGradient = abs(vUv.y - 0.5) * displacedSin(uTime) * 2.0;
  float strength = max(verticalGradient, horizontalGradient);
  gl_FragColor = vec4(vec3(strength), 1.0);
}

