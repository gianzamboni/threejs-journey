precision highp float;

varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 textureColor = vec4(vUv, 1.0, 1.0);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = textureColor;
}