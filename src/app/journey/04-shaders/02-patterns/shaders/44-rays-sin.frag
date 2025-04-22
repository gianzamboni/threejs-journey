precision mediump float;

#define PI 3.14159265358979323846
varying vec2 vUv;

void main() {
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  float strength = sin(angle * 100.0);
  gl_FragColor = vec4(vec3(strength), 1.0);
}