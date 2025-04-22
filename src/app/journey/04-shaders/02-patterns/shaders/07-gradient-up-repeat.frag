precision mediump float;

varying vec2 vUv;

/*
Black & White Gradient Horizontal Bars
================================
  This will generate 10 horizontal bars with a grayscale gradient. 
  (x, y) => rgb((y*10) % 1, (y*10) % 1, (y*10) % 1)

  The % operator returns the remainder of the division of y*10 by 1.
  This means that the value will be 0 for every multiple of 1.

  So lets see the values for the first 2/10 of the pixels:

  The bottom bar goes from (x, 0) to (x, 0.999...), the second bar goes from (x, 0.1) to (x, 0.19999999999999998) and so on.

  (x, 0) => (0*10) % 1 = 0 => rgb(0, 0, 0) => Start black
  (x, 0.09) => (0.099*10) % 1 = 0.99 % 1 = 0.99 => rgb(0.99, 0.99, 0.99) => End white

  (x, 0.1) => (0.1*10) % 1 = 1 % 1 = 0 => rgb(0, 0, 0) => Jump to black, start of the second bar
  (x, 0.19) => (0.19*10) % 1 = 1.9 % 1 = 0.9 => rgb(0.9, 0.9, 0.9) => End white

  (x, 0.2) => (0.2*10) % 1 = 20 % 1 = 0 => rgb(0, 0, 0) => Start of the third bar
  (x, 0.29) => (0.29*10) % 1 = 2.9 % 1 = 0.9 => rgb(0.9, 0.9, 0.9) => End white

  ... an so on.  
*/
void main() {
  float strength = mod(vUv.y * 10.0, 1.0);
  gl_FragColor = vec4(vec3(strength), 1.0);
}
