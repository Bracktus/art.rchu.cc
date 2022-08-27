let theShader;
let balls = [];

function preload(){
	theShader = loadShader(
      '/deployment/metaballs-2/meta2.vert',
      '/deployment/metaballs-2/meta2.frag'
  );
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 6; i++) {
      balls.push({
          vel: [random(), random()],
          pos: [random(width), random(height)]
      });
  }
}

function updateBalls() {
	let velX, velY;
	let posX, posY;
	
	for (let i = 0; i < balls.length; i++) {
		[velX, velY] = balls[i].vel;
		[posX, posY] = balls[i].pos;
		if (posX <= 0 || posX >= width) {
			velX *= -1;
		} 
		if (posY <= 0 || posY >= height) {
			velY *= -1;
		}
		
		if (mouseIsPressed) {
			velX += (mouseX - posX) * 0.001;
			velY += ((height - mouseY) - posY) * 0.001;
		} else {
			velX += sin(frameCount/100 + i) * 0.05 * i;
			velY += sin(frameCount/100 + i) * 0.05 * i;
		}
		
		balls[i].vel = [velX * 0.99, velY * 0.99];
		balls[i].pos = [posX + velX, posY + velY];
	}
}

//function mouseReleased() {
//	balls.forEach(ball => {
//		ball.vel = [random(-width/40, width/40), random(-height/40, height/40)];
//	})
//}

function draw() {
  shader(theShader);
	
		
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
	theShader.setUniform("u_xPos", balls.map(ball => ball.pos[0]/width - 0.5));
	theShader.setUniform("u_yPos", balls.map(ball => ball.pos[1]/height - 0.5));
	updateBalls();

  rect(0,0,width,height);
}
