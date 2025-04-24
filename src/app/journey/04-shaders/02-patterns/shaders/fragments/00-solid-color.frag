precision mediump float;

uniform float uTime;
void main() {
  float strength = sin(uTime * 1.5);
  gl_FragColor = vec4(strength, 0.0, 1.0, 1.0);
}