#version 100
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795
#define TAU 6.283185307179586476925286766559

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y*2.;
    float distance = length(uv);
    float angle = atan(uv.y, uv.x);
    float value = distance + angle/TAU + u_time;
    gl_FragColor = vec4(vec3(step(fract(value), .5)), 1.0);
    // gl_FragColor = vec4(vec3(step(fract(uv.x + u_time), .5)), 1.0); 
    // gl_FragColor = vec4(fract(gl_FragCoord.xy/u_resolution.xy*.1), 0.0, 1.0);
}