float bar(float value, float width) {
    return step(1.0 -width, mod(value * 10.0, 1.0));
}

vec3 applyColor(vec2 vUv, float strength) {
  vec3 blackColor = vec3(0.0);
  vec3 color = vec3(vUv, 1.0);
  float clampedStrength = clamp(strength, 0.0, 1.0);
  vec3 mixedColor = mix(blackColor, color, clampedStrength);
  return mixedColor;
}
