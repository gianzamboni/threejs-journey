vec3 ambientLight(vec3 color, float intensity) {
  return color * intensity;
}

vec3 directionalLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 viewDirection, float specularPower) {
  vec3  lightDirection = normalize(position);
  vec3 lightReflection = reflect(-lightDirection, normal);
  
  float specular = -dot(viewDirection, lightReflection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  float strength = dot(lightDirection, normal);
  strength = max(0.0, strength);

  return color * intensity * (strength + specular);
}

vec3 pointLight(vec3 color, float intensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float decayStrength) {
  vec3  lightDelta = lightPosition - position;
  float lightDistance = length(lightDelta);
  vec3  lightDirection = normalize(lightDelta);
  vec3 lightReflection = reflect(-lightDirection, normal);
  
  float specular = -dot(viewDirection, lightReflection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  float decay = 1.0 - lightDistance * decayStrength;
  decay = max(0.0, decay);
  
  float strength = dot(lightDirection, normal);
  strength = max(0.0, strength);

  return color * intensity * decay * (strength + specular);
}
