#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;

void main() {
    vec2 uv = gl_FragCoord.xy;
    uv /= u_resolution;

    
    vec3 texCol = texture2D(u_tex0, uv).rgb;
    vec3 bg = texCol * vec3(uv.x,uv.y,abs(sin(u_time)));
    gl_FragColor = vec4(bg, 1.0);
}


