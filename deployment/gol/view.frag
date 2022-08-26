#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t)  smoothstep(a, b, t)

uniform vec2 u_resolution;
uniform sampler2D u_state;

vec3 get(vec2 origin, int x, int y){
  //buffer space looks like
  //
  // (0,0)  +-------+ (0,1)
  //        |       |
  //        |       |
  //        |       |
  // (1,0)  +-------+ (1,1)
  
  //wheras shader space looks like
  // (0,height)  +-------+ (width,height)
  //             |       |
  //             |       |
  //             |       |
  // (0,0)       +-------+ (width,0)
  
  vec2 pos = vec2(origin) + vec2(x, y); // get neighbour index
  pos = vec2(pos.x, u_resolution.y - pos.y); //flipping y axis
  pos = pos / u_resolution; // scaling grid down into buffer space
  return texture2D(u_state, pos).rgb;
}

void main() {
    vec2 uv = gl_FragCoord.xy * 0.5; 
    vec3 col = get(uv, 0, 0);
    bool isBg = col.r > 0.5 ? false : true;

    if (isBg) {
        col = vec3(0.15, 0.1, 0.15);
    } else {
        col = vec3(253./255., 235./255., 3./255.);
    }
    
    gl_FragColor = vec4(col, 1.0);
}
