precision mediump float;

varying vec2 vUv;

void main() {
  float strength = distance(vUv, vec2(0.5));
  gl_FragColor = vec4(vec3(strength), 1.0);
}