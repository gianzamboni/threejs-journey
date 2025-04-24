precision mediump float;

varying vec2 vUv;


uniform float uTime;

#include '../utils.frag';

float compressAxis(float value) {
  return (value - 0.5) * (1.0 + abs(sin(uTime)) * 5.0) + 0.5;
}

float distanceToCenter(vec2 coord) {
  return distance(coord, vec2(0.5)); 
}

void main() {
  vec2 point = vec2(vUv.x, compressAxis(vUv.y));
  float strength = 0.15 / distanceToCenter(point);
  gl_FragColor = vec4(vec3(strength), 1.0);
}