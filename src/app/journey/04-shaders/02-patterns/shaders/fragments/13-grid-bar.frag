precision mediump float;

varying vec2 vUv;

/*
  Black & White Small Bars
  ========================
  In this shader, is like the grid-point.frag but we modified the step for the vertical bars. 
  This means that ther vertical bars are thicker (40% black - 60% white) that has more intersection with the horizontal bars.
*/

#include '../utils.frag';

void main() {
  float strength = bar(vUv.y, 0.2) * bar(vUv.x, 0.4);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}