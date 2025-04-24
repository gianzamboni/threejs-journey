precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

/*
  Black & White Small Bars
  ========================
  This shider adds to the grid-bars.frag a small white vertical bar creating a wedged shape. 

*/

float smallBar(float x, float y) {
  return step(0.4, mod(x - 0.2, 1.0)) * step(0.8, mod(y, 1.0));
}

void main() {
  float scale = 10.0;
  float x = vUv.x * scale;
  float y = vUv.y * scale;
  
  // Both Grids combined on one image
  float strength = smallBar(x, y) + smallBar(y, x);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}