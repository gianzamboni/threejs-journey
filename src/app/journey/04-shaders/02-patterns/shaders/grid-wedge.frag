precision mediump float;

varying vec2 vUv;

float mod10(float value) {
  return mod(value * 10.0, 1.0);
}

float bar(float value, float width) {
  return step(width, mod10(value));
}

/*
  Black & White Small Bars
  ========================
  This shider adds to the grid-bars.frag a small white vertical bar creating a wedged shape. 

*/
void main() {
  // Small Horizontal Bars Grid
  float barX = bar(vUv.x, 0.4) * bar(vUv.y, 0.8);
  
  // Small Vertical Bars Grid
  float barY = bar(vUv.x, 0.8) * bar(vUv.y, 0.4);

  // Both Grids combined on one image
  float strength = barX + barY;
  gl_FragColor = vec4(vec3(strength), 1.0);
}

