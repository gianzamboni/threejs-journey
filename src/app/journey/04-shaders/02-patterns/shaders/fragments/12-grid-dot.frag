precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

/*
  White Points
  ============
  This is the same as the grid.frag but instead of using a + to combine the bars, we use a *.
  This is because we want to make sure that the pixel is in both the x and y direction to be a point.
*/
void main() {
  float strength = thinBar(vUv.x) * thinBar(vUv.y);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}