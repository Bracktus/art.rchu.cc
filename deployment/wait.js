let t;
let t_state = true
let freq = 300;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	let bg = color(243, 232, 209);
	let red = color(206, 94, 92);
	let black = color(56, 56, 54);
	
	background(bg);
	let diam = Math.min(width, height);
	
	t = 2 * abs(frameCount/freq - Math.floor(frameCount/freq + 0.5));
	if (t <= 0 || t >= 1) t_state = !t_state;
	t = constrain(t, 0.01, 0.99);
	
	let r = diam/2;
	stroke(black);
	strokeWeight(4);
	noFill();
	arc(width/2, height/2,
			r, r,
			t_state ? 0 : f(1 - t) * TAU,
			t_state ? f(t) * TAU: TAU);
	
	let l_t = t_state ? f(t) : f(1 - t);
	circle(width / 2 + r*cos(l_t*TAU) * 0.5,
			 	 height / 2 + r*sin(l_t*TAU) * 0.5,
				 diam/100);
	
	let col = lerpColor(black, red, f(t));
	fill(col);
	stroke(col);
	circle(width/2, height/2, (diam/2) * f(t) * 0.9);
}

function f(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}
