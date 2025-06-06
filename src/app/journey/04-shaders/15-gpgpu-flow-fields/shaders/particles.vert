uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticles;

attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main()
{
    vec4 aParticles = texture2D(uParticles, aParticlesUv);
    // Final position
    vec4 modelPosition = modelMatrix * vec4(aParticles.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vColor = aColor;
}