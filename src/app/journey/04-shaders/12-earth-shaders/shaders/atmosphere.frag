uniform vec3 uSunDirection;
uniform vec3 uAtmosphereColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include "./common.glsl"

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(0.0);

  float sunOrientation = dot(uSunDirection, normal); 
  float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation); 
  float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);

  float edgeAlpha = dot(viewDirection, normal);
  edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

  float alpha = edgeAlpha * dayAlpha;

  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereColor, atmosphereDayMix);
  color += atmosphereColor;

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}