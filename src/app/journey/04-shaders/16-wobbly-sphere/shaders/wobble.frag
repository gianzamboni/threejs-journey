uniform vec3 uColorA;
uniform vec3 uColorB;


varying vec2 vUv;
varying float vWobble;

void main() {
  float colorMix = smoothstep(0.0, 1.0, vWobble);
  csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);
  csm_Roughness = 1.0 - colorMix;
  csm_Metalness = colorMix;
}