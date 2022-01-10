
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform int u_frameCount;
uniform vec2 u_trail_positions[30];
uniform vec2 u_anchor_positions[6];

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv -= 0.5;
    uv.x /= u_resolution.y;

    float r = 0.;
    float g = 0.;
    float b = 0.;

    float start, idx, d, val;
    for (int i = 0; i < 30; i++){
        d = length(uv - u_trail_positions[i]);
        val = (float(i)/20.) / d * 0.001;
        r += 0.5*val;
        g += 0.5*val;
    }
  
    for (int i = 0; i < 6; i++){
      d = length(uv - u_anchor_positions[i]);
      val = smoothstep(0.01, 0.0011, d);
      b += val;
    }
    gl_FragColor = vec4(r, g, b, 1.0);
}


