
#ifdef GL_ES
precision mediump float;
#endif

#define ss(a, b, t) smoothstep(a, b, t)
#define PI 3.1459

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_xPos[6];
uniform float u_yPos[6];

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 dotted(vec2 uv, float d){
		//when d is bigger than rand(uv)
		//return black
		//else return white
		vec3 bg = vec3(1.0, 0.95, 0.85);//White
		d *= d;
    return d > rand(uv) ? vec3(0.0) : vec3(1.0);
}

float getCharge(vec2 uv){
	
	float charge = 0.0;
	for (int i = 0; i < 6; i++) {
		vec2 pos = vec2(u_xPos[i], u_yPos[i]);
		charge += 0.03 * (sin(u_time*0.01 + float(i+1)/6.0) + 1.0) / length(uv - pos);
	}
	return charge;
}

void main() {
    //resolution stuff
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
		uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;
		
		float d = getCharge(uv);
		vec3 bg = vec3(dotted(uv, (1.0 - d)*5.0));
		if (d < 0.8 || d > 1.22) {
			bg = vec3(1.0,1.0,1.0);
		}
		
		bg = clamp(bg, 0.0, 1.0) - vec3(0.0, 0.023, 0.121);
    gl_FragColor = vec4(bg, 1.0);
}



