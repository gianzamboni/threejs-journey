uniform vec3 uColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include "../../../../utils/shaders/lights.glsl";

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 light = ambientLight(vec3(1.0), 1.0);
    light += directionalLight(
        vec3(1.0, 1.0, 1.0),
        1.0,
        normal,
        vec3(1.0, 1.0, 0.0),
        viewDirection,
        1.0
    );

    color *= light;

    vec3 direction = vec3(0.0, -1.0, 0.0);
    float repetitions = 50.0;
    float low = -0.8;
    float high = 1.5;
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    float point = 1.0 - step(0.5 * intensity, distance(uv, vec2(0.5)));

    color = mix(color, pointColor, point);
    // Final color
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}