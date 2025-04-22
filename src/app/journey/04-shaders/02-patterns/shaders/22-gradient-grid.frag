precision mediump float;

varying vec2 vUv;

float steppedGradient(float axis) {
  return floor(axis * 10.0) / 10.0;
}

void main() {
  float strength = steppedGradient(vUv.x) * steppedGradient(vUv.y);
  gl_FragColor = vec4(vec3(strength), 1.0);
}