precision mediump float;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float compressAxis(float value) {
  return (value - 0.5) * 5.0 + 0.5;
}

float distanceToCenter(vec2 uv) {
  return distance(uv, vec2(0.5)); 
}

float glare(vec2 uv) {
  return 0.15 / distanceToCenter(uv);
}

vec2 rotate(vec2 uv, float rotation, vec2 center) {
  vec2 rotatedUv = vec2(
    cos(rotation) * (uv.x - center.x) - sin(rotation) * (uv.y - center.y) + center.x,
    sin(rotation) * (uv.x - center.x) + cos(rotation) * (uv.y - center.y) + center.y
  );
  return rotatedUv;
}

void main() {
  vec2 rotatedUv = rotate(vUv, 0.25*PI, vec2(0.5));
  float xCompressed = compressAxis(rotatedUv.x);
  float yCompressed = compressAxis(rotatedUv.y);
  float strength = glare(vec2(xCompressed, vUv.y)) * glare(vec2(vUv.x, yCompressed));
  gl_FragColor = vec4(vec3(strength),1.0);
}