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

function addParticle(particles){
  let xPos = random(width);
  let yPos = random(height);
  
  let xVel = random(5);
  let yVel = random(5);
  
  let pos = createVector(xPos,yPos);
  let vel = createVector(xVel,yVel);
  let particle = new Particle(pos, vel);
  particles.push(particle);
}

function removeParticle(particles){
  let len = particles.length;
  if (len > 0){
     particles.shift();    
  }
}

function renderRandom(particles){
  let maxDist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  for (let i = 0; i < particles.length; i++){
    
    let friendIdx = Math.floor(random(0, particles.length - 1));
    let friend = particles[friendIdx];
    let me = particles[i];
    
    let dist = p5.Vector.dist(me.pos, friend.pos);
    let lerpVal = map(dist, 0, maxDist/2, 0, 1);
    let background = color(249, 248, 224);
    let black = color(0,0,0);
    let col = lerpColor(background, black, lerpVal);
    
    stroke(0);
    fill(0);
    circle(me.pos.x, me.pos.y, 3);
    stroke(col);
    line(me.pos.x, me.pos.y, friend.pos.x, friend.pos.y);
  }
}

function renderNearest(particles){
  let maxDist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  for (let i = 0; i < particles.length; i++){
    let me = particles[i];
    
    let nearest = getNearest(me, particles);
    let dist = p5.Vector.dist(me.pos, nearest.pos);
    let col = map(dist, 0, maxDist, 100, 255);
    stroke(0);
    fill(0);
    circle(me.pos.x, me.pos.y, 3);
    
    stroke(col);
    line(me.pos.x, me.pos.y, nearest.pos.x, nearest.pos.y);
  }
}

function getNearest(particle, neighbours){
  let dist = 100000000;
  let tmpDist;
  let nearest = null;
  for (let i = 0; i < neighbours.length; i++){
    let friend = neighbours[i]
    let isSelf = (friend == particle);
    tmpDist = p5.Vector.dist(particle.pos, friend.pos);
    
    if (tmpDist < dist && !isSelf){
      nearest = friend;
      dist = tmpDist;
    }
  }
  return nearest;
}

let particles; 

function setup(){
    createCanvas(600,600);
    particles = [];
    addParticle(particles);
    addParticle(particles);
    addParticle(particles);
  }

function draw(){
  background(249, 248, 224);
  for (let i = 0; i < particles.length; i++){
    particles[i].update();
  }
  if (particles.length > 2){
      renderNearest(particles);
  }
}

function keyPressed(){
  particles = [];
}

function mouseClicked(){
  addParticle(particles);
}

