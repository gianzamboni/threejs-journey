uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  vec3 dayColor = texture(uDayTexture, vUv).rgb;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;

  float sunOrientation = dot(uSunDirection, normal); 
  float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
  vec3 color = mix(nightColor, dayColor, dayMix);

  vec2 uvXTranslation = vec2(mod(vUv.x - uTime * 0.001, 1.0), vUv.y);
  vec2 specularCloudColor = texture(uSpecularCloudsTexture, uvXTranslation).rg;
  float cloudMix = smoothstep(0.0, 1.0, specularCloudColor.g / 2.0) * dayMix ;
  color = mix(color, vec3(1.0), cloudMix);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}