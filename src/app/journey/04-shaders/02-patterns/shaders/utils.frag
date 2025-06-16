
precision mediump float;

#define PI 3.14159265358979323846

float bar(float value, float width) {
    return step(1.0 - width, mod(value * 10.0, 1.0));
}

float thinBar(float value) {
  return bar(value, 0.2);
}

vec3 applyColor(vec2 vUv, float strength) {
  vec3 blackColor = vec3(0.0);
  vec3 color = vec3(vUv, 1.0);
  float clampedStrength = clamp(strength, 0.0, 1.0);
  vec3 mixedColor = mix(blackColor, color, clampedStrength);
  return mixedColor;
}

float sweep(float value, float time) {
  return (sin(time) + 1.0) / 2.0 * mod(floor(value) - 1.0, 2.0);
} 

vec3 horizontalSweep(vec2 vUv, float time, float strength) {
  float x = sweep(vUv.x, time);
  return applyColor(vec2(x, vUv.y), strength);
}

vec3 verticalSweep(vec2 vUv, float time, float strength) {
  float y = sweep(vUv.y, time);
  return applyColor(vec2(vUv.x, y), strength);
}

float displacedSin(float x) {
  return sin(x ) + 0.5;
}

vec2 rotate(vec2 uv, float rotation, vec2 center) {
  vec2 rotatedUv = vec2(
    cos(rotation) * (uv.x - center.x) - sin(rotation) * (uv.y - center.y) + center.x,
    sin(rotation) * (uv.x - center.x) + cos(rotation) * (uv.y - center.y) + center.y
  );
  return rotatedUv;
}

vec3 colorRotation(vec2 vUv, float uTime, float strength) {
  vec2 rotatedUv = rotate(vUv, uTime, vec2(0.5));
  vec3 color = applyColor(rotatedUv, strength);
  return color;
}
