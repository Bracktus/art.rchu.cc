    #ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define ss(a, b, t) smoothstep(a, b, t)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D tex0;

float sdSegment(vec2 uv, vec2 p1, vec2 p2){
    vec2 v1 = uv - p1;
    vec2 v2 = p2 - p1;
    float h = clamp(dot(v1, v2)/dot(v2, v2), 0.0, 1.0);
    return length(v1 - v2*h);
}

float ex(vec2 uv){
    vec2 a = vec2(0.7, 0.7);
    vec2 b = vec2(0.3, 0.3);
    vec2 c = vec2(0.3, 0.7);
    vec2 d = vec2(0.7, 0.3);
    float t1 = sdSegment(uv, a, b);
    float t2 = sdSegment(uv, c, d);
    t1 = ss(0.035, 0.032, t1); 
    t2 = ss(0.035, 0.032, t2);
    return max(t1, t2);
}

float circle(vec2 uv){
    float d = length(uv - vec2(0.5));
    float c1 = ss(0.07, 0.065, d);
    float c2 = ss(0.3, 0.295, d) - ss(0.25, 0.245, d);
    return max(c1, c2);
}

void main(){

    // NORMALISATION
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;


    float n = 60.0;
    vec2 px = floor(uv*n)/n;
    vec4 tex = texture2D(tex0, 1.0 - px);

    uv *= n;
    uv = fract(uv);

    float lightness = (0.2126 * tex.r + 
                       0.5870 * tex.g + 
                       0.0722 * tex.b);

    vec3 bg = vec3(0.0);
    vec3 col = vec3(lightness + 0.25);
    if (lightness > 0.75){
        bg = max(ex(uv), circle(uv)) * col;
        
    }
    else if (lightness > 0.5){
        bg = ex(uv) * col;
    }
    else if (lightness > 0.25){
        bg = circle(uv) * col;
    }
    else{
        float d = length(uv - vec2(0.5));
        bg = ss(0.04, 0.0395, d)* vec3(1.0);
    }
    
    /* vec4 tex = texture2D(tex0, vec2(og.x, 1.0 - og.y)); */
    

    // DRAWING
    gl_FragColor = vec4(bg, 1.0); 
}


