float sunStrength(float min, vec3 normal) {
  float sunOrientation = dot(uSunDirection, normal); 
  return smoothstep(min, 1.0, sunOrientation);
}
