uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform float uTime;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;
uniform vec2 uResolution;

varying float vMaxElevation;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

#include "../../../../utils/shaders/perlin-noise-3d.glsl";

float getElevation(vec3 position) {
    float speed = uTime * uBigWavesSpeed;
    float elevation = sin(position.x * uBigWavesFrequency.x + speed) 
        * sin(position.z * uBigWavesFrequency.y + speed) 
        * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++) {
        elevation -= abs(cnoise(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main() {
    float pixelSize =  0.5 * (1.0 / uResolution.x + 1.0 / uResolution.y);;
    float shift = 0.25;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    float elevation = getElevation(modelPosition.xyz);
    modelPosition.y += elevation;
    modelPositionA.y += getElevation(modelPositionA);
    modelPositionB.y += getElevation(modelPositionB);

    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    vElevation = elevation;
    vMaxElevation = uSmallWavesElevation + uBigWavesElevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
    vUv = uv;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}