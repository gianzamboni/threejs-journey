precision mediump float;

varying vec2 vUv;

uniform float uTime;
#include '../utils.frag';
void main() {
  float verticalGradient = abs(vUv.x - 0.5);
  float horizontalGradient = abs(vUv.y - 0.5);
  float centeredGradient = max(verticalGradient, horizontalGradient);
  float bigFrame =  step(0.2, centeredGradient);
  float smallSquare = 1.0 - step(0.25, centeredGradient);
  float strength = bigFrame * smallSquare;
  vec3 color = colorRotation(vUv, uTime * 1.5, strength);
  gl_FragColor = vec4(color, 1.0);
}

