uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main()
{
    vec2 perlinUv = vUv;
    perlinUv.x *= 0.5;
    perlinUv.y *= 0.3;
    perlinUv.y -= uTime * 0.0325;
    
    float smoke = texture2D(uPerlinTexture, perlinUv).r;
    smoke = smoothstep(0.4, 1.0, smoke);
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.5, vUv.y);

    gl_FragColor = vec4(0.6, 0.3, 0.2, smoke / 2.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}