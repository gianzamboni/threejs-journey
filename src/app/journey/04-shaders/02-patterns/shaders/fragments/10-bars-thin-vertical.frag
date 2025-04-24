precision mediump float;

varying vec2 vUv;

uniform float uTime;
/*
Black & White Thin Vertical Bars
================================
This is similar to the horizontal bars, but we are using the x coordinate instead of the y coordinate.
*/

#include '../utils.frag';

void main() {
    float strength = bar(vUv.x, 0.2);
    vec3 color = verticalSweep(vUv, uTime, strength);
    gl_FragColor = vec4(color, 1.0);
}

