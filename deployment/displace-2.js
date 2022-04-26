class Particle {

    constructor(pos, targ){
        this.pos = pos;
        this.targ = targ
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
    }

    getTargForce(){
        let diff = p5.Vector.sub(this.targ, this.pos);
        let len = diff.mag();
        let force = createVector(0,0);

        if (len > 0.5){
            diff.normalize();
            let multiplier = map(min(len, 5), 0, 5, 0, 0.5);
            diff.mult(multiplier);
            force.add(diff);
        }
        return force;
    }

    getRepelForce(){
        let m = createVector(
            mouseX + bounds.w/2, 
            mouseY - bounds.h/2
        );
        let diff = p5.Vector.sub(this.pos, m);
        let len = diff.mag();
        let force = createVector(0,0);
        if (len < 30){
            force.add(diff);
            force.mult(0.3);
        }
        return force;
    }

    update(){
        let tForce = this.getTargForce();
        let rForce = this.getRepelForce();
        let force = p5.Vector.add(tForce, rForce);

        this.vel.mult(0.98);
        this.vel.add(force);
        this.pos.add(this.vel);
    }

    render(){
        stroke(251, 129, 24);
        circle(this.pos.x, this.pos.y, 5);
    }
}

function preload(){
    font = loadFont("font/FantasqueSansMono-Regular.ttf");
}

let bounds;
let particles = [];  
let input;
let text;
let button;

function reset(){
    text = input.value();
    let fontSize = min(width/2, height/2)*0.6;
    bounds = font.textBounds(text, width/2, height/2, fontSize);
    let points = font.textToPoints(text, width/2, height/2, fontSize);
    particles = [];
    for (let i = 0; i < points.length; i++){
        let p = points[i];
        let pos = createVector(p.x,p.y);
        let targ = createVector(p.x,p.y);
        let part = new Particle(pos, targ);
        particles.push(part);
    }
}

function setup(){
    createCanvas(windowWidth,windowHeight);

    input = createInput("art.rchu.cc");
    input.position(20,65);
    input.input(reset);
    input.style("background", "rgb(0,0,0)");
    input.style("color", "rgb(255,255,255)");
    input.style("border", "1px solid rgb(255, 255,255)");
    input.style("padding", "5px");
    input.style("border-radius", "3px");

    reset();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  reset();
}

function draw(){
    translate(-bounds.w/2, bounds.h/2);
    background(0, 0, 0, 100);
    noFill();

    for (let p of particles){
        p.update();
        p.render();
    }
}


