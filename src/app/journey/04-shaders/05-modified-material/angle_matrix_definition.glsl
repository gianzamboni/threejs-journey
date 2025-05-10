#ifndef ANGLE_MATRIX_DEFINITION_GLSL
#define ANGLE_MATRIX_DEFINITION_GLSL

float speed = (sin(uTime * 0.5) + 1.0) * uTime * 0.015;

float angle = (position.y + uTime) * speed;
float revert = position.y;
mat2 rotationMatrix = createRotationMatrix(angle);

#endif

