precision mediump float;

varying vec2 vUv;

#include '../perlin-noise.frag';

void main() {
  float strength = 1.0 -abs(cnoise(vUv * 10.0));
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}