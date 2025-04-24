precision mediump float;

varying vec2 vUv;

uniform float uTime;

void main() {
  vec2 deformedUv= vec2(
vUv.x + sin(vUv.y * uTime * 5.0) * 0.1, 
vUv.y + sin(vUv.x * uTime * 5.0) * 0.1
  );
  float fadedRing = abs(distance(deformedUv, vec2(0.5)) - 0.25);
  float strength = 1.0 - step(0.01, fadedRing);
  gl_FragColor = vec4(vec3(strength), 1.0);
}