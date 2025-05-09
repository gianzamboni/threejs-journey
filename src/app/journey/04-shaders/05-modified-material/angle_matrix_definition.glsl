#ifndef ANGLE_MATRIX_DEFINITION_GLSL
#define ANGLE_MATRIX_DEFINITION_GLSL

float angle = (position.y + uTime) * uTime * 0.25;
mat2 rotationMatrix = createRotationMatrix(angle);

#endif

