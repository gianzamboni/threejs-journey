#include <common>

uniform float uTime;
mat2 createRotationMatrix(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}
