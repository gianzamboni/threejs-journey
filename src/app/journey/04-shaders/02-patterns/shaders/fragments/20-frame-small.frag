precision mediump float;

varying vec2 vUv;

void main() {
  float verticalGradient = abs(vUv.x - 0.5);
  float horizontalGradient = abs(vUv.y - 0.5);
  float centeredGradient = max(verticalGradient, horizontalGradient);
  float bigFrame =  step(0.2, centeredGradient);
  float smallSquare = 1.0 - step(0.25, centeredGradient);
  float strength = bigFrame * smallSquare;
  gl_FragColor = vec4(vec3(strength), 1.0);
}

