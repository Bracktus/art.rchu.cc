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

float lightness(vec4 col){
    return (0.2126 * col.r + 
            0.5870 * col.g + 
            0.0722 * col.b);
}

float l2 (vec4 color){
    return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

float edgeMag(vec2 uv, float n){
    //https://en.wikipedia.org/wiki/Sobel_operator#Formulation

    uv = 1.0 - uv;
    float sx = 1./u_resolution.x;
    float sy = 1./u_resolution.y;

    float bleft = l2(texture2D(tex0, uv + vec2(-sx, -sy)));
    float bottom = l2(texture2D(tex0, uv + vec2(0, -sy)));
    float bright = l2(texture2D(tex0, uv + vec2(sx, -sy)));

    float left = l2(texture2D(tex0, uv + vec2(-sx, 0)));
    float right = l2(texture2D(tex0, uv + vec2(sx, 0)));

    float tleft = l2(texture2D(tex0, uv + vec2(-sx, sy)));
    float top = l2(texture2D(tex0, uv + vec2(0, sy)));
    float tright = l2(texture2D(tex0, uv + vec2(sx, sy)));

    float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
    float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
    return sqrt((x*x) + (y*y));
}

void main(){

    // NORMALISATION
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    float n = 45.0;

    vec2 px = 1.0 - (floor(uv*n)/n);
    vec4 tex = texture2D(tex0, px);
    float l = lightness(tex);

    float e = edgeMag(uv, n);
    uv.x *= u_resolution.x/u_resolution.y;
    uv = fract(uv * n);

    vec3 bg = vec3(0.1);
    vec3 col;

    if (e > 0.25){
        col = vec3(1.0);
    }
    else{
         col = vec3(l+ 0.1);
    }

    if (l > 0.75){
        bg = max(ex(uv), circle(uv)) * col;
    }
    else if (l > 0.6){
        bg = ex(uv) * col;
    }
    else if (l > 0.3 && l < 0.5){
        bg = circle(uv) * col;
    }

    else{
        float d = length(uv - vec2(0.5));
        bg = ss(0.1, 0.095, d) * vec3(1.0);
    }
    
    // DRAWING
    gl_FragColor = vec4(bg, 1.0); 
}


