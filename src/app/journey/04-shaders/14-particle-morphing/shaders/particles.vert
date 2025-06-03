attribute vec3 aPositionTarget;
attribute float aSize;

uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform float uTime;

varying vec3 vPosition;
varying float vNoise;
#include simplexNoise.glsl


float PI = 3.14159265358979323846;

void main() {
    // Final position
    float noiseOrigin = simplexNoise3d(position * 0.2) ;
    float noiseTarget = simplexNoise3d(aPositionTarget * 0.2) ;
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    

    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);
    
    float angle = 4.0 * PI * progress + uTime * 0.1;
    angle *= -1.0;

    mat4 rotationMatrix = mat4(
      cos(angle), 0.0, sin(angle), 0.0,
      0.0, 1.0, 0.0, 0.0,
      -sin(angle), 0.0, cos(angle), 0.0,
      0.0, 0.0, 0.0, 1.0
    );

    vec4 modelPosition = modelMatrix * rotationMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y * sin(uTime * aSize);
    gl_PointSize *= (1.0 / - viewPosition.z);

    vNoise = noise;
}