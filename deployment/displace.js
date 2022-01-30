let num = 30;
let mPrev = [];

function setup() {
  createCanvas(windowWidth, windowHeight/2);
  colorMode(HSB, 100);
}

function draw() {
  background(0, 0, 10);
  stroke(255);
  strokeWeight(3);

  let which = frameCount % num;
  mPrev[which] = createVector(mouseX, mouseY);

  let part;
  let diff;
  for (let x = 5; x < width; x += 15) {
    for (let y = 5; y < height; y += 15) {

      part = createVector(x, y);
      if (frameCount > num) {
        for (let i = 0; i < num; i++) {
          let index = (which+1 + i) % num;

          if (p5.Vector.dist(mPrev[index], part) < i*2) {
            diff = p5.Vector.sub(part, mPrev[index]);
            part.add(p5.Vector.mult(diff, 0.1));
          }
        }
      }
      if (mouseIsPressed){
          stroke((frameCount+y+0.1*x)*0.1 % 100, 80, 100);
          fill((frameCount+y+0.1*x)*0.1 % 100, 80, 100);
      }
      else{
      stroke(0,0,100);
      }
      point(part.x, part.y);
    }
  }
}
