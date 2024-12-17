uniform float uTime;
uniform float uRadius;

varying vec3 vPosition;
varying vec3 vColor;

void main() {
    vPosition = position;
    vColor = color;

    vec3 pos = position;
    float angle = uTime * 0.5;

    // Rotate around Y axis
    pos.x = position.x * cos(angle) - position.z * sin(angle);
    pos.z = position.x * sin(angle) + position.z * cos(angle);

    // Add some noise movement
    pos.x += sin(uTime * 2.0 + position.y * 4.0) * 0.02;
    pos.y += cos(uTime * 2.0 + position.x * 4.0) * 0.02;
    pos.z += sin(uTime * 2.0 + position.z * 4.0) * 0.02;

    vec4 mvPosition = modelViewMatrix * vec4(pos * uRadius, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation
    gl_PointSize = 2.0 * (1.0 - length(mvPosition.xyz) * 0.1);
}
