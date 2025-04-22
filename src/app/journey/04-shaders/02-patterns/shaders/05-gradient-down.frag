precision mediump float;

varying vec2 vUv;

   /*
    Black & White Y Inverted Gradient
    ================================
      (x, y) => rgb(1-y, 1-y, 1-y)

      Bottom side is (x, 0) => rgb(1.0, 1.0, 1.0)
      Top side is (x, 1) => rgb(0, 0, 0)
    */
void main() {
  float strength = 1.0 - vUv.y;
  gl_FragColor = vec4(vec3(strength), 1.0);
}
