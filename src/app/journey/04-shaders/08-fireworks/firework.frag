uniform sampler2D uTexture;
uniform vec3 uColor;
void main() {
    float textureAlpha = texture2D(uTexture, gl_PointCoord).r;
    vec3 color = uColor.rgb;
    gl_FragColor = vec4(color, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}