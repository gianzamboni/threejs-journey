precision mediump float;

#define PI 3.14159265358979323846
varying vec2 vUv;

void main() {
  float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
  gl_FragColor = vec4(vec3(strength), 1.0);
}