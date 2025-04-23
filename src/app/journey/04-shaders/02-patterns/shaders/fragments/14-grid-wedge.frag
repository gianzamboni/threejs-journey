precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

/*
  Black & White Small Bars
  ========================
  This shider adds to the grid-bars.frag a small white vertical bar creating a wedged shape. 

*/

float smallBar(float value1, float value2) {
  return bar(value1, 0.6) * bar(value2, 0.2);
}

void main() {
  // Small Horizontal Bars Grid
  float barX = smallBar(vUv.x, vUv.y);
  
  // Small Vertical Bars Grid
  float barY = smallBar(vUv.y, vUv.x);

  // Both Grids combined on one image
  float strength = barX + barY;
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}

