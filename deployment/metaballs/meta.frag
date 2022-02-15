#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;


    vec2 b1 = vec2(0.0, 0.2) + vec2(0.0, u_mouse.x/10000.0);
    vec2 b2 = vec2(-0.01,-0.02);
    float charge_a = (0.05 / length(uv - b1)); 
    float charge_b = (0.05 / length(uv - b2));
    
    vec3 bg = vec3(step(0.8, charge_a + charge_b));

    gl_FragColor = vec4(bg, 1.0);
}


