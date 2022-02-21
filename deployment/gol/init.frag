#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t)  smoothstep(a, b, t)
uniform vec2 u_resolution;
uniform float u_time;

float random (vec2 uv) {
    //https://thebookofshaders.com/10/
    return fract(sin(dot(uv.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    //resolution stuff
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;
    float col = (random(uv) - 0.5)*2.0;
    vec3 bg = vec3(col > 0.8 ? 1.0 : 0.0); 

    gl_FragColor = vec4(bg, 1.0);
}


