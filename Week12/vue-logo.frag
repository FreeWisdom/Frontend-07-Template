precision mediump float;

void mainImage() {
    // vec3 r = vec3(100.0, 100.0, 1.0);
}

float distance(vec2 point, vec3 line) {
    return (line.x * point.x + line.y * point.y + line.z) / sqrt(point.x * point.x + point.y * point.y);
}

void main() {
    // vec3 st = gl_FragCoord.xy;
    vec4 lightgreen = vec4(0.26, 0.72, 0.51, 1.0);
    vec4 darkgreen = vec4(0.208, 0.286, 0.368, 1.0);
    vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

    // float d1 = distance(gl_FragCoord, vec3(1, -0.589, 100.0))
    float stepSize = 0.8;
    float a = 0.592;

    if(gl_FragCoord.x < 100.0) {
        float d1 = (100.0 - a * gl_FragCoord.y - gl_FragCoord.x + 10.0) / sqrt(0.589 * 0.589 + 1.0);
        float d2 = (100.0 - a * gl_FragCoord.y - gl_FragCoord.x + 50.0) / sqrt(0.589 * 0.589 + 1.0);
        float d3 = (100.0 - a * gl_FragCoord.y - gl_FragCoord.x + 87.0) / sqrt(0.589 * 0.589 + 1.0);

        gl_FragColor = mix(white, lightgreen, smoothstep(d1 - stepSize, d1 + stepSize, 0.));
        gl_FragColor = mix(gl_FragColor, darkgreen, smoothstep(d2 - stepSize, d2 + stepSize, 0.));
        gl_FragColor = mix(gl_FragColor, white, smoothstep(d3 - stepSize, d3 + stepSize, 0.));
    } else {
        float d1 = (100.0 - a * gl_FragCoord.y - 200.0 + gl_FragCoord.x + 10.0) / sqrt(0.589 * 0.589 + 1.0);
        float d2 = (100.0 - a * gl_FragCoord.y - 200.0 + gl_FragCoord.x + 50.0) / sqrt(0.589 * 0.589 + 1.0);
        float d3 = (100.0 - a * gl_FragCoord.y - 200.0 + gl_FragCoord.x + 87.0) / sqrt(0.589 * 0.589 + 1.0);

        gl_FragColor = mix(white, lightgreen, smoothstep(d1 - stepSize, d1 + stepSize, 0.));
        gl_FragColor = mix(gl_FragColor, darkgreen, smoothstep(d2 - stepSize, d2 + stepSize, 0.));
        gl_FragColor = mix(gl_FragColor, white, smoothstep(d3 - stepSize, d3 + stepSize, 0.));
    }

    if(gl_FragColor.y > 187.0)
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

}