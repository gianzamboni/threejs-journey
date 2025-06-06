precision mediump float;

varying vec2 vUv;

uniform float uTime;

void main() {
  float strength = atan(vUv.x - 0.5, vUv.y - 0.5) * sin(uTime) * 1.5;
  gl_FragColor = vec4(vec3(strength), 1.0); 
}