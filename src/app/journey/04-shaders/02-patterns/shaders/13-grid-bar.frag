precision mediump float;

varying vec2 vUv;

float bar(float value, float edge) {
  return step(edge, mod(value * 10.0, 1.0));
}

/*
  Black & White Small Bars
  ========================
  In this shader, is like the grid-point.frag but we modified the step for the vertical bars. 
  This means that ther vertical bars are thicker (40% black - 60% white) that has more intersection with the horizontal bars.
*/
void main() {
  float horizontalBars = bar(vUv.y, 0.8);
  float verticalBars = bar(vUv.x, 0.4);
  float strength = horizontalBars * verticalBars;
  gl_FragColor = vec4(vec3(strength), 1.0);
}