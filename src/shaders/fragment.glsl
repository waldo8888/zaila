varying vec3 vPosition;
varying vec3 vColor;

void main() {
    // Create a circular particle
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Smooth circle
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    
    // Add glow effect
    vec3 color = vColor;
    color += pow(1.0 - dist, 3.0) * 0.5;
    
    gl_FragColor = vec4(color, alpha);
}
