precision mediump float;

varying vec2 vUv;

void main() {
  float strength = step(0.5, mod(vUv.y * 10.0, 1.0));
  gl_FragColor = vec4(vec3(strength), 1.0);
}
