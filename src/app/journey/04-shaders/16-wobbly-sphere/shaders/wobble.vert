#include "../../../../utils/shaders/simplexNoise4d.glsl"

attribute vec4 tangent;

uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

varying vec2 vUv;
varying float vWobble;

float getWobble(vec3 position) {
  vec3 warpedPosition = position;
  warpedPosition += simplexNoise4d(vec4(position * uWarpPositionFrequency, uTime * uWarpTimeFrequency)) * uWarpStrength;
  return simplexNoise4d(vec4(warpedPosition * uPositionFrequency, uTime * uTimeFrequency)) * uStrength;
}

void main() {
  //csm_Position.y += sin(csm_Position.z * 3.0) * 0.5;
  vec3 bitangent = cross(normal, tangent.xyz);

  float shift = 0.01;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + bitangent * shift;

  float wobble = getWobble(csm_Position);
  csm_Position += wobble * normal;
  positionA += getWobble(positionA) * normal;
  positionB += getWobble(positionB) * normal;

  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = normalize(cross(toB, toA));

  vUv = uv;
  vWobble = wobble;
}