precision mediump float;

varying vec2 vUv;

/*
Black & White Thin Vertical Bars
================================
This is similar to the horizontal bars, but we are using the x coordinate instead of the y coordinate.
*/
void main() {

    float strength = mod(vUv.x * 10.0 + 0.01, 1.0);
    strength = step(0.8, strength);
    gl_FragColor = vec4(vec3(strength), 1.0);
}

