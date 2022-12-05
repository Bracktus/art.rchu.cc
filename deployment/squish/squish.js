let theShader;
let pg;
let seed;

function preload(){
	theShader = loadShader('/deployment/squish/vert.glsl', '/deployment/squish/frag.glsl');
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
	pg = createGraphics(windowWidth, windowHeight);
}

function draw() {
  // shader() sets the active shader with our shader
	noCursor();
  shader(theShader);
	sketch(pg);

  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
	theShader.setUniform("u_tex0", pg);

  // rect gives us some geometry on the screen
  rect(0,0,width,height);
}

let accSpeed = 0;
const squishFactor = 0.85;
let off = 0;

function sketch(pg) {
  pg.background(210, 233, 178);

  let minWH = min(width, height);
  let dVec = createVector(mouseX - pmouseX, mouseY - pmouseY);
  let speed = dVec.mag();
  let angle = dVec.heading();
  let easers = color(10, 10, 10);

  accSpeed *= 0.9; 
  if (!almostZero(accSpeed)) {
    accSpeed = 0;
  }
  accSpeed += speed;
	off += 0.015;

	//Draw the big circle
  pg.push();
	pg.translate(width/2, height/2);
	let r = minWH*0.45;
	pg.fill(66, 68, 62)
	pg.stroke(93, 94, 83);
	pg.strokeWeight(3);
	pg.circle(0,0,r*2);
	
  pg.pop();

	// Draw the cursor
  pg.push();
	let mx = mouseX - width/2;
	let my = mouseY - height/2
	
	if (mx*mx + my*my > r*r) {
		pg.fill(66, 68, 62);
		pg.stroke(93, 94, 83);
	} 
  let mSize = minWH/20;
	
  pg.translate(mouseX, mouseY);
  pg.rotate(angle + PI/2);
  pg.ellipse(0,0, 
						 mSize - accSpeed * squishFactor * 0.25, 
						 mSize + accSpeed * squishFactor);
	pg.strokeWeight(1);
	
	if (mx*mx + my*my > r*r) {
		pg.fill(255);
		pg.stroke(255);
	} else {
		pg.fill(easers);
		pg.stroke(255)
	}
  pg.ellipse(0,0, 
						 (mSize - accSpeed * squishFactor * 0.25) * 0.3, 
						 (mSize + accSpeed * squishFactor)* 0.3);
  pg.pop();
}

const almostZero = n => abs(n) < 0.01;

function f(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}
