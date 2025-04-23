precision mediump float;

varying vec2 vUv;

float compressAxis(float value) {
  return (value - 0.5) * 5.0 + 0.5;
}

float distanceToCenter(float x, float y) {
  return distance(vec2(x, y), vec2(0.5)); 
}

float glare(float x, float y) {
  return 0.15 / distanceToCenter(x, y);
}

void main() {
  float xCompressed = compressAxis(vUv.x);
  float yCompressed = compressAxis(vUv.y);
  
  
  float strength = glare(vUv.x, yCompressed) * glare(xCompressed, vUv.y);
  gl_FragColor = vec4(vec3(strength), 1.0);
}