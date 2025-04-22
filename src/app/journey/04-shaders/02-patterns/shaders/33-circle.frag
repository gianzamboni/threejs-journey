precision mediump float;

varying vec2 vUv;

void main() {
  float fadedCircle = distance(vUv, vec2(0.5));
  float strength = step(0.25, fadedCircle);
  gl_FragColor = vec4(vec3(strength), 1.0);
}