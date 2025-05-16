uniform vec3 uColor;

varying vec3 vNormal;

varying vec3 vPosition;
#include "./lights-fuctions.glsl"

void main(){
  vec3 nomrmalDirection = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  vec3 light = ambientLight(
    vec3(1.0), // Light color
    0.03 // Light intensity
  );
  
  light += directionalLight(
    vec3(0.1, 0.1, 1.0), // Light color
    1., // Light intensity
    nomrmalDirection, // Normal direction
    vec3(1.0, 1.0, 1.0), // Light position
    viewDirection, // View direction
    20.0 // Specular power
  );


  light += pointLight(
    vec3(1.0, 0.1, 0.0), // Light color
    1., // Light intensity
    nomrmalDirection, // Normal direction
    vec3(0.0, 2.5, 0.0), // Light position
    viewDirection, // View direction
    20.0, // Specular power
    vPosition, // Position
    0.3 // Decay
  );
  
  vec3 color = uColor;
  color *= light;

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}