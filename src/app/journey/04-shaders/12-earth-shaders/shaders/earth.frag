uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform float uTime;
uniform vec3 uAtmosphereColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include "./common.glsl"

float fresnel(vec3 normal, vec3 viewDirection) {
  float fresnel = dot(viewDirection, normal) + 1.0;
  return pow(fresnel, 2.0);
}

vec3 daylight(float strength) {
  vec3 dayColor = texture(uDayTexture, vUv).rgb;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;
  return mix(nightColor, dayColor, strength);
}

float clouds(float strength) {
  vec2 uvXTranslation = vec2(mod(vUv.x - uTime * 0.001, 1.0), vUv.y);
  float specularCloudColor = texture(uSpecularCloudsTexture, uvXTranslation).g;
  return smoothstep(0.0, 1.0, specularCloudColor / 2.0) * strength;
}

vec3 atmosphere(vec3 color, vec3 normal, float strength) {
  float atmosphereStrength = sunStrength(-0.5, normal);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereColor, atmosphereStrength);
  return mix(color, atmosphereColor, strength * atmosphereStrength);
}

vec3 sunLightReflection(vec3 normal, vec3 viewDirection, float fresnelStrength, float cloudsStrength) {
  vec3 reflection = reflect(-uSunDirection, normal);
  float specular = -dot(reflection, viewDirection);
  specular = max(specular, 0.0);
  specular = pow(specular, 32.0);
  vec3 color = mix(vec3(1.0), uAtmosphereColor, fresnelStrength);
  float specularCloudColor = clamp(texture(uSpecularCloudsTexture, vUv).r + cloudsStrength, 0.0, 1.0);
  return specular * color * specularCloudColor;
}

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  float daylightStrength = sunStrength(-0.25, normal);
  float fresnelStrength = fresnel(normal, viewDirection);
  
  vec3 color = daylight(daylightStrength);
  float cloudStrength = clouds(daylightStrength);

  color = mix(color, vec3(1.0), cloudStrength);
  color = atmosphere(color, normal, fresnelStrength);
  color += sunLightReflection(normal, viewDirection, fresnelStrength, cloudStrength);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}