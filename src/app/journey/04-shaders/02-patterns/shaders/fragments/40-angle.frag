
precision mediump float;

varying vec2 vUv;

void main() {
  float strength = atan(vUv.x, vUv.y);
  gl_FragColor = vec4(vec3(strength), 1.0);
}