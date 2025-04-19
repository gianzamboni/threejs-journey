precision mediump float;

varying vec2 vUv;

/*
Black & White Y Gradient
================================
  (x, y) => rgb(y, y, y)

  Bottom side is (x, 0) => rgb(0, 0, 0)
  Top side is (x, 1) => rgb(1.0, 1.0, 1.0)
*/
void main() {
  float strength = vUv.y;
  gl_FragColor = vec4(vec3(strength), 1.0);
}
