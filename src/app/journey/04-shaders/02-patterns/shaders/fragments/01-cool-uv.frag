precision mediump float;

varying vec2 vUv;

uniform float uTime;

void main() {
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}