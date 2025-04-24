precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../utils.frag';

void main() {
  float fadedRing = abs(distance(vUv, vec2(0.5)) - abs(sin(uTime * 0.5)) * 0.4);
  float strength = 1.0 - step(0.02, fadedRing);
  gl_FragColor = vec4(vec3(strength), 1.0);
}