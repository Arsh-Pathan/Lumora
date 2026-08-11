/**
 * LUMORA Graphics — WebGL 2.0 Shaders Pipeline
 */

export const VERTEX_SHADER_QUAD = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;

uniform mat3 u_homography;
uniform mat3 u_projection;

out vec2 v_texCoord;

void main() {
    // Apply 3x3 homography matrix to input unit coordinates
    vec3 mapped = u_homography * vec3(a_position, 1.0);
    vec2 pos = mapped.xy / mapped.z;
    
    // Project to NDC clip space (-1..1)
    vec3 clip = u_projection * vec3(pos, 1.0);
    gl_Position = vec4(clip.xy, 0.0, 1.0);
    
    v_texCoord = a_texCoord;
}
`;

export const VERTEX_SHADER_MESH = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;

uniform mat3 u_projection;

out vec2 v_texCoord;

void main() {
    vec3 clip = u_projection * vec3(a_position, 1.0);
    gl_Position = vec4(clip.xy, 0.0, 1.0);
    v_texCoord = a_texCoord;
}
`;

export const FRAGMENT_SHADER_SURFACE = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform float u_opacity;
uniform float u_brightness;   // -1.0 to 1.0
uniform float u_contrast;     // 0.0 to 2.0
uniform float u_saturation;   // 0.0 to 2.0
uniform float u_hue;          // degrees -180 to 180
uniform float u_gamma;        // 0.1 to 3.0
uniform vec3 u_tintColor;     // RGB tint
uniform float u_tintAmount;   // 0.0 to 1.0

// Hue rotation helper
vec3 applyHue(vec3 col, float hueDeg) {
    float angle = hueDeg * 3.14159265 / 180.0;
    vec3 k = vec3(0.57735);
    float cosAngle = cos(angle);
    return col * cosAngle + cross(k, col) * sin(angle) + k * dot(k, col) * (1.0 - cosAngle);
}

void main() {
    // Sample texture
    vec4 texColor = texture(u_texture, v_texCoord);
    vec3 color = texColor.rgb;
    
    // 1. Brightness (-1 to 1)
    color += u_brightness;
    
    // 2. Contrast (0 to 2, 1 is normal)
    color = (color - 0.5) * u_contrast + 0.5;
    
    // 3. Saturation (0 to 2, 1 is normal)
    float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(gray), color, u_saturation);
    
    // 4. Hue rotation
    if (abs(u_hue) > 0.01) {
        color = applyHue(color, u_hue);
    }
    
    // 5. Gamma correction
    color = pow(max(color, vec3(0.0)), vec3(1.0 / max(u_gamma, 0.001)));
    
    // 6. Color tinting
    if (u_tintAmount > 0.001) {
        color = mix(color, u_tintColor, u_tintAmount);
    }
    
    // Clamp output
    color = clamp(color, 0.0, 1.0);
    
    fragColor = vec4(color, texColor.a * u_opacity);
}
`;

export const FRAGMENT_SHADER_CALIBRATION = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform int u_pattern; // 0=grid, 1=crosshair, 2=checkerboard, 3=colorbars, 4=red, 5=green, 6=blue, 7=white, 8=black
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    if (u_pattern == 0) { // Grid
        vec2 grid = abs(fract(st * 20.0 - 0.5) - 0.5) / fwidth(st * 20.0);
        float line = min(grid.x, grid.y);
        float c = 1.0 - min(line, 1.0);
        fragColor = vec4(vec3(c), 1.0);
    } 
    else if (u_pattern == 1) { // Crosshair
        float lineX = step(abs(st.x - 0.5), 0.002);
        float lineY = step(abs(st.y - 0.5), 0.002);
        float circle = step(abs(length(st - 0.5) - 0.2), 0.002);
        fragColor = vec4(vec3(max(max(lineX, lineY), circle)), 1.0);
    } 
    else if (u_pattern == 2) { // Checkerboard
        vec2 check = floor(st * 16.0);
        float c = mod(check.x + check.y, 2.0);
        fragColor = vec4(vec3(c), 1.0);
    } 
    else if (u_pattern == 3) { // Color bars
        int bar = int(st.x * 7.0);
        if (bar == 0) fragColor = vec4(1.0, 1.0, 1.0, 1.0);
        else if (bar == 1) fragColor = vec4(1.0, 1.0, 0.0, 1.0);
        else if (bar == 2) fragColor = vec4(0.0, 1.0, 1.0, 1.0);
        else if (bar == 3) fragColor = vec4(0.0, 1.0, 0.0, 1.0);
        else if (bar == 4) fragColor = vec4(1.0, 0.0, 1.0, 1.0);
        else if (bar == 5) fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        else fragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } 
    else if (u_pattern == 4) { fragColor = vec4(1.0, 0.0, 0.0, 1.0); } // Red
    else if (u_pattern == 5) { fragColor = vec4(0.0, 1.0, 0.0, 1.0); } // Green
    else if (u_pattern == 6) { fragColor = vec4(0.0, 0.0, 1.0, 1.0); } // Blue
    else if (u_pattern == 7) { fragColor = vec4(1.0, 1.0, 1.0, 1.0); } // White
    else { fragColor = vec4(0.0, 0.0, 0.0, 1.0); } // Black
}
`;
