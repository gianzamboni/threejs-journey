precision mediump float;

varying vec2 vUv;

uniform float uTime;
#include '../perlin-noise.frag';

void main() {
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * uTime * 2.0));
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}