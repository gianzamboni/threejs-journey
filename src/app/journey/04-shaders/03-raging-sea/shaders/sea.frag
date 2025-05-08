precision highp float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vMaxElevation;
varying float vElevation;

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 waterColor = mix(uDepthColor, uSurfaceColor, mixStrength);

  float foamAmount = smoothstep( vMaxElevation * 0.75, vMaxElevation, vElevation);
  vec3 foamColor = vec3(1.0, 1.0, 1.0);
  vec3 mixedColor = mix(waterColor, foamColor, foamAmount);
  gl_FragColor = vec4(mixedColor, 1.0);
  
  #include <colorspace_fragment>
}