precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float strength = abs( vUv.x - displacedSin(uTime));
  gl_FragColor = vec4(vec3(strength), 1.0);
}