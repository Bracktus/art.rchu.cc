class Spring {
    constructor(origin, unit) {
        this.origin = origin;
        this.position = origin.copy();

        this.unit = unit;
        this.velocity = createVector(0,0);
        this.restLength = 0;
    }

    update(force, tension){
        let direction = p5.Vector.sub(this.position, this.origin);
        let displacement = direction.mag() - this.restLength;
        direction.normalize();

        let acceleration = p5.Vector.mult(direction, -tension * displacement);
        acceleration.add(force);

        this.velocity.add(acceleration);
        this.velocity.mult(0.95);
        this.position.add(this.velocity);
    }

    getLength() {
        return p5.Vector.sub(this.position, this.origin).mag();
    }

    pull(dist) {
        let vec = p5.Vector.mult(this.unit, dist);
        this.position.add(vec);
    }
}

class Blob {
    constructor(origin, radius, numSprings){
        this.origin = origin;
        this.radius = radius;
        this.springs = this.init(origin, radius, numSprings);
    }

    init(origin, radius, numSprings){
        let springs = [];
        let angle;
        let resting;
        let unit;

        for (let i = 0; i < numSprings; i++){
            angle = (i / numSprings) * TWO_PI;
            resting = createVector(radius * cos(angle),
                                   radius * sin(angle));
            resting.add(origin);
            unit = p5.Vector.sub(origin, resting).normalize();
            springs[i] = new Spring(resting, unit);
        }
        return springs;
    }
    
    update(){
        let numSprings = this.springs.length;
        let spread = 0.15;
        let lDiff = [];
        let rDiff = [];

        for (let i = 0; i < numSprings; i++){
            let leftIdx = (i != 0) ? i - 1 : numSprings - 1;
            let rightIdx = (i + 1) % numSprings;

            let currLen = this.springs[i].getLength();
            let leftLen = this.springs[leftIdx].getLength();
            let rightLen = this.springs[rightIdx].getLength();;

            lDiff[i] = spread*(leftLen - currLen);
            rDiff[i] = spread*(rightLen - currLen);
        }

        for (let i = 0; i < numSprings; i++){
            let currSpring = this.springs[i];
            let totalDiff = lDiff[i] + rDiff[i];
            let total = mag2Vec(currSpring.unit, totalDiff);

            currSpring.update(total, 0.4)
        }
    }

    render(canvas) {
        canvas.beginShape();
        this.springs.forEach(s => {
            canvas.vertex(s.position.x, s.position.y);
        });
        canvas.endShape();
    }
    
    closestSpring(position) {
        const dist2pos = p => p5.Vector.dist(position, p);
        const distances = this.springs.map(s => [dist2pos(s.position), s]);
        const closest = distances.reduce((prev, curr) => {
            let prevDist = prev[0];
            let currDist = curr[0];
            return (prevDist < currDist) ? prev : curr;

        });
        return closest[1];
    }
}

const mag2Vec = (unit, mag) => p5.Vector.mult(unit, mag);
const mousePos = () => createVector(mouseX - width/2, -(mouseY - height/2))
const numSprings = 35;


let blob;
let closestLocked;
let blobMask;
let rad;

function preload() {
     theShader = loadShader("/deployment/bounce-2/bounce-2.vert",
                            "/deployment/bounce-2/bounce-2.frag");
}

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    blobMask = createGraphics(windowWidth, windowHeight);
    blobMask.translate(width/2, height/2);
    
    const start = createVector(0,0);
    rad = min(width, height)/4;
    blob = new Blob(start, rad, numSprings);
}

function draw(){
    blobMask.background(0);
    blobMask.fill(255);
    blobMask.noStroke();
    blob.render(blobMask);

    const mouse = mousePos();
       
    if (mouseIsPressed) {
        const spring = closestLocked;
        const springPos = closestLocked.position;
        const proj = p5.Vector.dot(mouse, springPos) / springPos.mag();
        const len = max(proj, rad/16);
        spring.position = p5.Vector.mult(spring.unit, -len);

    } else {
        //Show closest point
        const spring = blob.closestSpring(mouse);
        const springPos = spring.position;

        blobMask.fill(255, 0, 0);
        blobMask.circle(springPos.x, springPos.y, 10);
        blob.update()
    }

    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_tex0", blobMask);
    theShader.setUniform("u_time", frameCount * 0.01);
    rect(0,0, width, height);
    // noLoop();
}

function mousePressed(){
   const mouse = mousePos();
   closestLocked = blob.closestSpring(mouse);
}

function mouseReleased(){
    closestLocked = null;
}
