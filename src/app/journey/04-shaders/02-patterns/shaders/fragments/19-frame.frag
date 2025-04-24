precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float verticalGradient = abs(vUv.x - 0.5);
  float horizontalGradient = abs(vUv.y - 0.5);
  float strength = step(0.25, max(verticalGradient, horizontalGradient));
  vec3 color = colorRotation(vUv, uTime * 1.5, strength);
  gl_FragColor = vec4(color, 1.0);
}

