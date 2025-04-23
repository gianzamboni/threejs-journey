precision mediump float;

varying vec2 vUv;

#include '../perlin-noise.frag';

void main() {
  float strength = sin(cnoise(vUv * 10.0) * 20.0);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}