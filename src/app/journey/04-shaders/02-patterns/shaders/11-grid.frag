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
float bar(float value) {
    return step(0.8, mod(value * 10.0, 1.0));
}

void main() {

  // horizontalBars is 1 if the y coordinate is in a horizontal bar and 0 otherwise.
  float horizontalBars = bar(vUv.y); 

  // verticalBars is 1 if the x coordinate is in a vertical bar and 0 otherwise.
  float verticalBars = bar(vUv.x);
  
  /* strength is 1 if the pixel if part of the grid and 0 otherwise. 
    Because we are working with only black and white, you can think of the sum as an OR operation 
    => If the x coord is part of a vertical bar or the y coord is part of a horizontal bar, the pixel is part of the grid.
    This are all possible combinations:
    - x in vertical bar, y in horizontal bar => 1
    - x in vertical bar, y not in horizontal bar => 1
    - x not in vertical bar, y in horizontal bar => 1
    - x not in vertical bar, y not in horizontal bar => 0 
  */
  float strength = horizontalBars + verticalBars; 
  gl_FragColor = vec4(vec3(strength), 1.0);
}

