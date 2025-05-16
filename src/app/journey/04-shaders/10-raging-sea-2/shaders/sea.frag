precision highp float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vMaxElevation;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
#include "../../../../utils/shaders/lights.glsl";

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  vec3 light = vec3(0.0);
  light += directionalLight(
    vec3(1.0, 1.0, 1.0),
    1.0,
    normal,
    vec3(-1.0, 0.5, 0.0),
    viewDirection,
    30.0
  );

  light += pointLight(
    vec3(1.0),            // Light color
    10.0,                 // Light intensity,
    normal,               // Normal
    vec3(0.0, 0.25, -10.0), // Light position
    viewDirection,        // View direction
    30.0,                 // Specular power
    vPosition,            // Position
    0.0005                  // Decay
);
  
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = clamp(mixStrength, 0.0, 1.0);

  vec3 waterColor = mix(uDepthColor, uSurfaceColor, mixStrength);

  waterColor *= light;

  float alpha = 1.0 - distance(vUv, vec2(0.5, 0.5)) * 2.0;
  gl_FragColor = vec4(waterColor, alpha);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}