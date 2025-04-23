precision mediump float;

varying vec2 vUv;

/* 
Black & White Thin Horizontal Bars
=================================
This will generate 10 horizontal white bars. We do this in two steps:
  1. We multiply the y coordinate by 10 and use the mod function with 1.0 to divide the plane into 10 equal parts.
  2. We use the step function to get a binary value (0 or 1) for each pixel. This will be 1 if the pixel is in the white bar and 0 otherwise. The value 0.8 means that the first 80% portion of each part will be black and the last 20% will be white.

  (x, y) => {  y in [0, 1]
    scale = y * 10 in [0, 10]
    mod(scale, 1.0) in [0, 1] -> is a cycle of 10 bars, maps each range to the range [0, 1):
      1. [0, 0.1)  => [0, 1), 
      2. [0.1, 0.2) => [1, 0), 
      3. [0.2, 0.3) => [0, 1), 
      4. [0.3, 0.4) => [1, 0), 
      5. [0.4, 0.5) => [0, 1), 
      6. [0.5, 0.6) => [1, 0), 
      7. [0.6, 0.7) => [0, 1), 
      8. [0.7, 0.8) => [1, 0), 
      9. [0.8, 0.9) => [0, 1), 
      10. [0.9, 1.0) => [0, 1)
    
    step(0.8, bar[i]) => 0,1 -> Transform the range [0, 1) to binary values 0 or 1. If the value is less than 0.8, it will be 0, otherwise it will be 1.
  }

  The result is a binary pattern of 10 horizontal white bars on a black background.
*/

#include '../utils.frag';

void main() {
  float strength = bar(vUv.y, 0.2);
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);  
}
