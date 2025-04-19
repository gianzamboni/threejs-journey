precision mediump float;

varying vec2 vUv;

    /*
    Vertical Squeezed Gradient
    ================================
      In this case, we accelerate the gradient by multiplying by 10. 
      This means that the gradient will reach white faster (when y = 0.1)
      
      (x, y) => rgb(y*10, y*10, y*10) si y <= 0.1
      (x, y) => rgb(1, 1, 1) si y * 10 > 0.1

      (x, 0) => rgb(0, 0, 0)
      (x, [0.1, 1]) => rgb(1.0, 1.0, 0)
    */
void main() {
  float strength = vUv.y * 10.0;
  gl_FragColor = vec4(vec3(strength), 1.0);
}
