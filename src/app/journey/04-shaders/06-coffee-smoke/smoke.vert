
varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;

vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}


float getPerlin(float x, float y) {
  return texture(uPerlinTexture, vec2(x, y)).r;
}

void main(){
  vUv = uv;
  
  vec3 newPosition = position;

  float twist = getPerlin(0.5, uv.y * 0.2 - uTime * 0.00325) * 0.5;
 
  vec2 windOffset = vec2(
    getPerlin(0.25, uTime * 0.01) - 0.5, 
    getPerlin(0.75, uTime * 0.01) - 0.5
  );

  float angle = twist * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);
  newPosition.xz += windOffset * pow(uv.y, 2.0) * 5.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}