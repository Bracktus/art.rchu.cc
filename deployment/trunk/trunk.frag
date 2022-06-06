
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
    d = d*d;
    return rand(uv) > d ? bg : fg;
}

void main() {
    //resolution stuff
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    
    vec3 bg = vec3(1.0, 0.96, 0.945);//White
    
    vec2 pos = vec2(0.540,0.470);
    
    float d = 2.904*uv.y - sin(2.0*uv.x + u_time)-0.5;
    d = ss(0.500, 0.700, d) - ss(0.7, 0.800, d);
    float d2 = 3.928*uv.x - sin(4.00*uv.y + u_time)-0.5;
    d2 =  ss(0.604, 0.724, d2) - ss(0.708, 0.816, d2);

    float k = ((cos(u_time) + 1.) * 0.5)*0.728;
    float d3 = 4.0*uv.y - sin(2.0*uv.x + u_time + 3.14 + k)-2.116;
    d3 =  ss(0.196, 0.388, d3) - ss(0.460, 0.536, d3);
    d = max(max(d,d2),d3);
    if (d > 0.1) { 
        bg = dotted(uv, d*0.85, vec3(0.0), bg); 
    }
    gl_FragColor = vec4(bg, 1.0);
}



