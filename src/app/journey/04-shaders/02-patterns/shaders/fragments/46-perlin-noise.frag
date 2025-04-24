precision mediump float;

varying vec2 vUv;

uniform float uTime;

#include '../perlin-noise.frag';

void main() {
  float strength = cnoise(vUv * 10.0);
  gl_FragColor = vec4(vec3(strength), 1.0);
}