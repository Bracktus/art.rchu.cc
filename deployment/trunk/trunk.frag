#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t) smoothstep(a, b, t)
#define PI 3.1459

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 dotted(vec2 uv, float d, vec3 bg, vec3 fg){
    d *= d;
    return rand(uv) > d ? bg : fg;
}

void main() {
    //resolution stuff
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    uv -= 0.5;

    vec2 pos = vec2(0.5,0.0);
    vec3 bg = vec3(1.0, 0.96, 0.945);
    
    float d = length(uv - sin(uv.x))*0.1;
    bg = ss(0.1, 0.11, d) * vec3(0.0);
    //bg = dotted(uv, d, bg, vec3(0.0));
    
    gl_FragColor = vec4(bg, 1.0);
}


