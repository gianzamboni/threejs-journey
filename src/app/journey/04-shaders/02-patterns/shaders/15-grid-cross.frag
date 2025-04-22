precision mediump float;

varying vec2 vUv;

float mod10(float value) {
  return mod(value * 10.0 - 0.2, 1.0);
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
  float scale = 10.0;
  float x = vUv.x * scale;
  float y = vUv.y * scale;

  
  
  // Small  Bars Grid
  float barX = step(0.4, mod(x - 0.2, 1.0)) * step(0.8, mod(y, 1.0));
  
  // Vertical Bars Grid
  float barY = step(0.8, mod(x, 1.0)) * step(0.4, mod(y - 0.2, 1.0));
  // Both Grids combined on one image
  float strength = barX + barY;
  gl_FragColor = vec4(vec3(strength), 1.0);
}

