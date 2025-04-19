precision mediump float;

varying vec2 vUv;

float bar(float value) {
  return step(0.8, mod(value * 10.0, 1.0));
}

/*
  White Points
  ============
  This is the same as the grid.frag but instead of using a + to combine the bars, we use a *.
  This is because we want to make sure that the pixel is in both the x and y direction to be a point.
*/
void main() {
  float strength = bar(vUv.x) * bar(vUv.y);
  gl_FragColor = vec4(vec3(strength), 1.0);
}