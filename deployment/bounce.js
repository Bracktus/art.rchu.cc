class Circle {
  constructor(origin, radius, numSprings) {
    this.origin = origin;
    this.radius = radius;
    this.springs = this.generate(origin, radius, numSprings);
  }

  generate(origin, radius, numSprings) {
    let springs = [];
    let angle;
    let springOrigin;
    let unitV;

    for (let i = 0; i < numSprings; i++) {
      angle = (i / numSprings) * TWO_PI;
      springOrigin = createVector(radius * cos(angle), radius * sin(angle));
      springOrigin.add(origin);
      unitV = p5.Vector.sub(origin, springOrigin);
      springs[i] = new Spring(springOrigin, unitV.normalize());
    }
    return springs;
  }

  pullRandom(dist) {
    let rand = random(this.springs);
    rand.pull(dist);
  }

  update() {
    let lDiff;
    let rDiff;
    let spread = 0.005;

    let rightForce;
    let leftForce;
    let finalForce;

    for (let i = 0; i < this.springs.length; i++) {
      if (i == 0) {
        lDiff =
          this.springs[this.springs.length - 1].getLength() -
          this.springs[i].getLength();
      } else {
        lDiff = this.springs[i - 1].getLength() - this.springs[i].getLength();
      }

      if (i == this.springs.length - 1) {
        rDiff = this.springs[0].getLength() - this.springs[i].getLength();
      } else {
        rDiff = this.springs[i + 1].getLength() - this.springs[i].getLength();
      }

      leftForce = this.springs[i].magToVector(lDiff * spread);
      rightForce = this.springs[i].magToVector(rDiff * spread);
      finalForce = p5.Vector.add(leftForce, rightForce);
      this.springs[i].pull(lDiff * 0.1);
      this.springs[i].pull(rDiff * 0.1);
      this.springs[i].update(finalForce, 0.05);
    }
  }

  display() {
    noFill();
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].display();
    }
  }
}

class Spring {
  constructor(origin, unit) {
    this.origin = origin; //start
    this.position = origin.copy(); //end
    this.unit = unit;
    this.velocity = createVector(0, 0);
    this.restLength = 0;
  }

  update(extraForce, tension) {
    let direction = p5.Vector.sub(this.position, this.origin);
    let displacement = direction.mag() - this.restLength;

    direction.normalize();
    let acceleration = p5.Vector.mult(direction, -tension * displacement); //hooke's law
    acceleration.add(extraForce);

    this.velocity.add(acceleration);
    this.velocity.mult(0.98); //dampening
    this.position.add(this.velocity);
  }

  display() {
    stroke(0);
    fill(0);
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    circle(this.position.x, this.position.y, 1);
  }

  pull(dist) {
    this.position.add(this.magToVector(dist));
  }

  getLength() {
    return p5.Vector.sub(this.position, this.origin).mag();
  }

  magToVector(magnitude) {
    return p5.Vector.mult(this.unit, magnitude);
  }
}

let start1;
let circle1;
let circle2;
let circle3;
let circle4;
let circle5;
let circle6;
let circle7;

let numCirc = 7;
let circleList = [];

function setup() {
  let l = windowHeight * 0.75;
  createCanvas(l, l);
  start1 = createVector(0, 0);
  circleList[0] = new Circle(start1, l*0.2, 100);
  circleList[1] = new Circle(start1, l*0.25, 100);
  circleList[2] = new Circle(start1, l*0.3, 100);
  circleList[3] = new Circle(start1, l*0.35, 100);
  circleList[4] = new Circle(start1, l*0.4, 100);
  circleList[5] = new Circle(start1, l*0.45, 100);
  circleList[6] = new Circle(start1, l*0.5, 100);
}

function draw() {
  translate(width / 2, height / 2);
  clear();
  background(236, 233, 231, 0.8);
  fill(255);
  for (let i = 0; i < numCirc; i++) {
    circleList[i].update();
    circleList[i].display();
  }
}

function mousePressed() {
  let power;
  for (let times = 0; times < 20; times++) {
    for (let i = 0; i < numCirc; i++) {
      power = circleList[i].radius / 2;
      circleList[i].pullRandom(power);
    }
  }
}
