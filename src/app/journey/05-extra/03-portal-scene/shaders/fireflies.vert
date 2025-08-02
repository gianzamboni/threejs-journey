uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float y = sin(uTime + modelPosition.x * 100.0) * aScale * 0.1;
    float z = sin(uTime + modelPosition.y * 100.0) * aScale * 0.1;
    float x = sin(uTime + modelPosition.z * 100.0) * aScale * 0.1;

    modelPosition.y += y;
    modelPosition.z += z;
    modelPosition.x += x;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * uPixelRatio * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
}