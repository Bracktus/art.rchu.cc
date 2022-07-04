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
        this.velocity.mult(0.96);
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
        let spread = 0.3;
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

            currSpring.update(total, 0.6)
        }
    }

    render() {
        beginShape();
        this.springs.forEach(s => {
            vertex(s.position.x, s.position.y);//a list of points 
        });
        endShape();
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
const mousePos = () => createVector(mouseX - width/2, mouseY - height/2);
const numSprings = 30;
let blob;

function setup(){
    createCanvas(windowWidth, windowHeight);
    const start = createVector(0,0);
    const rad = min(width, height)/4;
    blob = new Blob(start, rad, numSprings);
}

function draw(){
    translate(width/2, height/2);
    background(0);
    fill(255);

    blob.render();
    blob.update();
    const mouse = mousePos();
    const spring = blob.closestSpring(mouse);
    fill(255, 0, 0);
    circle(spring.position.x, spring.position.y, 10);
    fill(255);

}

function mousePressed(){
    const mouse = mousePos();
    const spring = blob.closestSpring(mouse);
    spring.pull(-40);
}

