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
        let m = createVector(mouseX + bounds.w/2, mouseY - bounds.h/2);
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

function reset(text){
    let fontSize = min(width/2, height/2)*0.6;
    bounds = font.textBounds(text, width/2, height/2, fontSize);
    let points = font.textToPoints(text, width/2, height/2, fontSize);
    for (let i = 0; i < points.length; i++){
        let p = points[i];
        let pos = createVector(p.x,p.y);
        let targ = createVector(p.x,p.y);
        let part = new Particle(pos, targ);
        particles.push(part);
    }
}

function setup(){
    let text = "art.rchu.cc";
    createCanvas(windowWidth ,windowHeight * 0.8);
    reset(text);


    let inp = createInput();
    inp.position(0, windowHeight * 0.8);
    inp.input(myInputEvent);
    button = createButton("Submit");
    button.position(0, 0);
    button.mousePressed(reset(input.value));
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


