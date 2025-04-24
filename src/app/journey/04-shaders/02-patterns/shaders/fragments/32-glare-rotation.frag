precision mediump float;

varying vec2 vUv;

#include '../utils.frag';

uniform float uTime;

float compressAxis(float value) {
  return (value - 0.5) * (5.0 + abs(sin(uTime)) * 5.0) + 0.5;
}


float distanceToCenter(vec2 uv) {
  return distance(uv, vec2(0.5)); 
}

float glare(vec2 uv) {
  return 0.15 / distanceToCenter(uv);
}

void main() {
  vec2 rotatedUv = rotate(vUv, 0.25*PI, vec2(0.5));
  float xCompressed = compressAxis(rotatedUv.x);
  float yCompressed = compressAxis(rotatedUv.y);
  float strength = glare(vec2(xCompressed, vUv.y)) * glare(vec2(vUv.x, yCompressed));
  gl_FragColor = vec4(vec3(strength),1.0);
}