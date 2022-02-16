#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t)  smoothstep(a, b, t)
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec3 charge(vec2 uv, vec2 pos, float rad){
    vec2 r = pos + vec2(sin(u_time/100.)*0.003, 0.0);
    vec2 g = r + vec2(0.001, -0.001);
    vec2 b = pos + vec2(cos(u_time/100.)*0.003, sin(u_time/100.)*0.002);

    float chargeR = rad / length(uv - r); 
    float chargeG = rad / length(uv - g); 
    float chargeB = rad / length(uv - b); 

    return vec3(chargeR, chargeG, chargeB);
}



void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;

    /* vec2 b1 = vec2(0.1, 0.3); */
    vec2 mou = u_mouse;
    mou.y *= -1.;
    vec2 b1 = mou;
    vec2 b2 = vec2(0.3, 0.01);

    vec3 c1 = charge(uv, b1, 0.05);
    vec3 c2 = charge(uv, b2, 0.08);

    vec3 total = c1 + c2;

    vec3 bg = vec3(0.0); 
    bg += vec3(ss(0.9, 0.92, total.r) - ss(0.95, 0.965, total.r)) * vec3(1., 0., 0.);
    bg += vec3(ss(0.9, 0.92, total.g) - ss(0.95, 0.965, total.g)) * vec3(0., 1., 0.);
    bg += vec3(ss(0.9, 0.92, total.b) - ss(0.95, 0.965, total.b)) * vec3(0., 0., 1.);


    
    gl_FragColor = vec4(bg, 1.0);
}


