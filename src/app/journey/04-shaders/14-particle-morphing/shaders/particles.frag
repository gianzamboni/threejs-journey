uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vNoise;

void main() {
    vec2 uv = gl_PointCoord;
    float distanceToCenter = distance(uv, vec2(0.5));
    float alpha = 0.05 / distanceToCenter - 0.1;

    vec3 color = mix(uColorA, uColorB, vNoise);
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}