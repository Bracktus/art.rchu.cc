
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_state;

vec3 tail(float i, float i_max, vec2 uv){
    float x, y, d, val;
    
    if (u_state == 0){
        x = 0.5 * tan(u_time*2.5 - i*0.01);
        y = 0.5 * sin(u_time*2.5 - i*0.01);
        d = length(uv - vec2(x,y));
        val = (i_max - i)/d*0.0009; 
    }
    else if (u_state == 1){
        x = 3.5 * sin(u_time*2.5 - i*0.05);
        y = sin((u_time*2.5 - i*0.05) * 2.0);
        x *= 0.2;
        y *= 0.2;
        d = length(uv - vec2(x,y));
        val = (i_max - i)/d*0.002; 
    }
    else {

        x = 0.5 * cos(3.*(u_time - i*0.008));
        y = 0.5 * sin(3.*(u_time - i*0.008)); 
        d = length(uv - vec2(x,y));
        val = (i_max - i)/d*0.001;
    }

    float r = val*0.5;
    float g = val*0.5;
    float b = 0.0;

    return vec3(r,g,b);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;

    vec3 col = vec3(0., 0., 0.); 
    for (float i = 0.0; i < 10.0; i++){
        col += tail(i, 10.0, uv);
    }
    gl_FragColor = vec4(col, 1.0);
}


