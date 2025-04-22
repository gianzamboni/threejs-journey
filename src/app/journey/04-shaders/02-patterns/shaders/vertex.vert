precision highp float;

uniform float aConstant;

varying vec2 vUv;
varying float vConstant;

void main() {
  vUv = uv;
  vConstant = aConstant;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}