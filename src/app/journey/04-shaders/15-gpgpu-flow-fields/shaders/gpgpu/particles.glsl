#include "../../../../../utils/shaders/simplexNoise4d.glsl"

uniform float uTime;
uniform sampler2D uBase;
uniform float uDeltaTime;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldFrequency;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture2D(uParticles, uv);
  vec4 base = texture2D(uBase, uv);

  if(particle.a > 1.0) {
    particle.a = mod(particle.a, 1.0);
    particle.xyz = base.xyz;
  } else {
    float time = uTime * 0.2;
    float flowFieldInfluence = (uFlowFieldInfluence - 0.5) * (-2.0);
    float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
    strength = smoothstep(flowFieldInfluence, 1.0, strength);
    
    vec3 flowField = vec3(
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
    ); 

    flowField = normalize(flowField);
    particle.xyz += flowField * uDeltaTime * strength * 0.5;    
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle;
}