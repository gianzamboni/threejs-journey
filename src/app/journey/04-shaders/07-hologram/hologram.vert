uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5;
}

float glitch(vec2 st, float y) {
  float glitchTime = uTime - y; 
  
  float strength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
  strength /= 3.0;
  strength = smoothstep(0.3, 1.0, strength);
  strength *= 0.1;
  return random(st + uTime) * strength - 0.5;
}

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += glitch(modelPosition.xz, modelPosition.y);
    modelPosition.z += glitch(modelPosition.zx, modelPosition.y);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vPosition = modelPosition.xyz;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
}