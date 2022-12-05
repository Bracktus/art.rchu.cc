#ifdef GL_ES
precision mediump float;
#endif
#define saturate(v) clamp(v,0.,1.)

uniform vec2 u_resolution;
uniform sampler2D u_tex0;

//Sources: https://gist.github.com/yiwenl/745bfea7f04c456e0101
//         https://gist.github.com/sugi-cho/6a01cae436acddd72bdf
vec3 hsv2rgb(vec3 c){
	vec4 K=vec4(1.,2./3.,1./3.,3.);
	return c.z*mix(K.xxx,saturate(abs(fract(c.x+K.xyz)*6.-K.w)-K.x),c.y);
}

//Source: https://gist.github.com/sugi-cho/6a01cae436acddd72bdf
vec3 rgb2hsv(vec3 c){
	vec4 K=vec4(0.,-1./3.,2./3.,-1.),
	     p=mix(vec4(c.bg ,K.wz),vec4(c.gb,K.xy ),step(c.b,c.g)),
	     q=mix(vec4(p.xyw,c.r ),vec4(c.r ,p.yzx),step(p.x,c.r));
	float d=q.x-min(q.w,q.y),
	      e=1e-10;
	return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);
}

vec2 flipY(vec2 uv) {
	return vec2(uv.x, 1.0 - uv.y);
}

void main() {
  // position of the pixel divided by resolution, to get normalized positions on the canvas
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;
	//Apply Vignette to image
	//We need to flip the Y axis to read the texture properly
	vec3 bg = texture2D(u_tex0, flipY(uv)).rgb;
	uv -= 0.5;
	
	bg = rgb2hsv(bg);
	vec2 d = abs(uv) * 2.0;
	bg.z = mix(bg.z, bg.z - 0.2, length(d)); 
	bg = hsv2rgb(bg);
  gl_FragColor = vec4(bg,1.0); 
}