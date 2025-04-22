precision mediump float;

varying vec2 vUv;

void main() {
  float strength = length(vUv);
  gl_FragColor = vec4(vec3(strength), 1.0);
}