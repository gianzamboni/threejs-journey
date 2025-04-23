precision mediump float;

varying vec2 vUv;

/*
  White Grid
  ==========
  This is a combination of horizontal and vertical bars.
*/

/*
  Given a pixel coordinate, this function return 1 if the pixel is in a bar and 0 otherwise. 
(For explanation of why this works, see thin-horizontal-bars.frag and thin-vertical-bars.frag) 
*/

#include '../utils.frag';

void main() {
  /* strength is 1 if the pixel if part of the grid and 0 otherwise. 
    Because we are working with only black and white, you can think of the sum as an OR operation 
    => If the x coord is part of a vertical bar or the y coord is part of a horizontal bar, the pixel is part of the grid.
    This are all possible combinations:
    - x in vertical bar, y in horizontal bar => 1
    - x in vertical bar, y not in horizontal bar => 1
    - x not in vertical bar, y in horizontal bar => 1
    - x not in vertical bar, y not in horizontal bar => 0 
  */
  float strength = thinBar(vUv.x) + thinBar(vUv.y); 
  vec3 color = applyColor(vUv, strength);
  gl_FragColor = vec4(color, 1.0);
}

