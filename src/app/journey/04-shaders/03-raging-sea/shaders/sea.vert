uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform float uTime;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;

#include "./perlin-noise-3d.glsl";

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float speed = uTime * uBigWavesSpeed;
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + speed) 
        * sin(modelPosition.z * uBigWavesFrequency.y + speed) 
        * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++) {
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.y += elevation;

    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}