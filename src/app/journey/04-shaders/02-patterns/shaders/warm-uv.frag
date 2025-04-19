precision mediump float;

varying vec2 vUv;

/* Warm UV (similar to Cool UV)
================================
  vUv is a vec2 that contains the x and y coordinates of the pixel (that range from 0 to 1)
    Here are the color of the corners rembember that the color in shaders is in normalizad rgb format (that means that each component goes from 0 to 1).
  Here i use 0-255 for the colors just because Visual Code adds a beautiful colored square to visualize the color this way:
  
  (x, y) => rgb(x, y, 0)
  Left bottom corner is (0, 0) => rgb(0, 0, 0)
  Right Left Corner is (0, 1) => rgb(0, 1.0, 0)
  Right Bottom Corner is (1, 0) => rgb(1.0, 0, 0)
  Right top corner is (1, 1) => rgb(1.0, 1.0, 0)

*/
void main() {
   gl_FragColor = vec4(vUv, 0.0, 1.0);
}

