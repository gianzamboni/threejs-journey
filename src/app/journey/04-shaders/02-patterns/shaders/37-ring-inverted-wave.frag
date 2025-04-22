precision mediump float;

varying vec2 vUv;

void main() {
  vec2 deformedUv= vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
  float fadedRing = abs(distance(deformedUv, vec2(0.5)) - 0.25);
  float strength = 1.0 - step(0.01, fadedRing);
  gl_FragColor = vec4(vec3(strength), 1.0);
}