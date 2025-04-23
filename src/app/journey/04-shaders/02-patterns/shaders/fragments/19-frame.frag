precision mediump float;

varying vec2 vUv;

void main() {
  float verticalGradient = abs(vUv.x - 0.5);
  float horizontalGradient = abs(vUv.y - 0.5);
  float strength = step(0.25, max(verticalGradient, horizontalGradient));
  gl_FragColor = vec4(vec3(strength), 1.0);
}

