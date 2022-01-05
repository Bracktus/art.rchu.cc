/* Sphere Equation (spiral ver)

x = sin(t) * cos(nt)
y = sin(t) * sin(nt)
z = cos(t)

0 <= t <= pi
*/

function setup() { 
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // the simplest method to enable the camera
  createEasyCam();

  // suppress right-click context menu
  document.oncontextmenu = function() { return false; }
} 

let numPoints = 1000;
let n = 100;
let r = 1000;
let sqang = 0;

function draw(){
  //camera
  background(0);
  lights();
  translate(width/2, height/2);
  
  //rendering
  let t, x, y, z;
	stroke(255);
	noFill();
  for(let i = 0; i < numPoints; i++){
    t = map(i, 0, numPoints, 0, PI);
    x = sin(t) * cos(n*t);
    y = sin(t) * sin(n*t);
    z = cos(t);
		
		rotate(sqang / 4);
		sqang += 0.0000001;
		push();
		rotate(sqang * 2);
		translate(x*r, y*r, z*r);
    box(25);
		pop();
  }
}
