uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform float uTime;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

float smootherStep(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  // Final position
  vec3 newPosition = position;
  
  
  float displacementIntensity = smoothstep(0.001 , 0.9, texture(uDisplacementTexture, uv).r);
  vec3 displacement = normalize(vec3(cos(aAngle)*0.2, sin(aAngle)*0.2, 1.0));
  newPosition += displacement * displacementIntensity * aIntensity * 3.0;
  newPosition.y += sin(uTime * aAngle) * 0.005;
  newPosition.x += cos(uTime * aAngle) * 0.005;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  float pictureIntensity = texture(uPictureTexture, uv).r;
  vColor = vec3(pow(pictureIntensity, 2.0));
  // Point size
  gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
