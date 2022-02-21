#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t)  smoothstep(a, b, t)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_state;

float random (vec2 uv) {
    //https://thebookofshaders.com/10/
    return fract(sin(dot(uv.xy,
                         vec2(12.9898,78.233)))*
        4358.5453123);
}

int get(vec2 origin, int x, int y){
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
  // (0,0)       +-------+ (1,0)
  
  vec2 pos = vec2(origin) + vec2(x, y); // get neighbour index
  pos = vec2(pos.x, u_resolution.y - pos.y); //flipping y axis
  pos = pos / u_resolution; // scaling grid down into buffer space
  return texture2D(u_state, pos).rgb == vec3(1.0) ? 1 : 0;
}

void main() {
    //resolution stuff
    vec2 uv = gl_FragCoord.xy;
    
    bool alive = get(uv, 0, 0) == 1;

    int sum = 0;
    for (int x = -1; x <= 1; x++){
      for (int y = -1; y <= 1; y++){
        if (x==0 && y== 0){continue;}
        sum += get(uv, x, y);
      }
    }

    vec3 data = vec3(0.0);
  
    if (alive && (sum == 3 || sum == 2))
    {
      data = vec3(1.0);
    }
    else if (!alive && sum == 3)
    {
      data = vec3(1.0);
    }
    

    if (length((uv/u_resolution - u_mouse/u_resolution)) < 0.005){
      data = vec3(1.0);
    }
    
    //populate grid
    if (u_time < 0.0)
    {
      float col = (random(uv) - 0.5)*2.0;
      data = vec3(col > 0.8 ? 1.0 : 0.0); 
    }
  
    gl_FragColor = vec4(data, 1.0);
}


