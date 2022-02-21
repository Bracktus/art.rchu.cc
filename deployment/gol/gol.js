let part;

class Particle {
  
  constructor(pos, vel){
    this.pos = pos;
    this.vel = vel;
  }
  
  update(){
    if (this.pos.x > width || this.pos.x < 0){
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0){ 
      this.vel.y *= -1;
    }
    this.pos.add(this.vel);
  }
}
  
function genParticle(){
  let xPos = random(width);
  let yPos = random(height);
  
  let xVel = random(3,5);
  let yVel = random(3,5);
  
  let pos = createVector(xPos,yPos);
  let vel = createVector(xVel,yVel);
  return new Particle(pos, vel);
}

function preload() {
    golShader = loadShader("gol.vert", "gol.frag");
}

function setup() {
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight, WEBGL);
    buffer = createGraphics(width, height, WEBGL);
    buffer.clear();
    textureMode(NORMAL);

    part = genParticle();
}

function draw() {
    part.update();

    buffer.shader(golShader);
    golShader.setUniform("u_state", buffer);
    golShader.setUniform("u_resolution", [width, height]);
    golShader.setUniform("u_time", frameCount * 0.01);
    golShader.setUniform("u_mouse", [part.pos.x, height - part.pos.y]);
    buffer.rect(0, 0, width, height);

    image(buffer, width * -0.5, height * -0.5, width, height);
}

