//Ported from racket

class Player {
    constructor(x,y, xVel, yVel){
        this.pos = createVector(x,y);
        this.vel = createVector(xVel,yVel);
        
        this.attached = false;
        this.direction = 1;
        this.trailLen = 30;
        this.trail = this.initTrail();
    }
  
    initTrail(){
      let t = [];
      for (let i = 0; i < this.trailLen; i++){
        t.push(createVector(0,0));
      }
      return t;
    }
    
    toData(){
        let data = [];
        //https://soegaard.github.io/sketching/Examples.html
        for (let i = 0; i < this.trailLen; i++){
            let start = frameCount % this.trailLen;
            let idx = (start + 1 + i) % this.trailLen;

            let x = this.trail[idx].x;            
            let y = this.trail[idx].y; 
            x = map(x, 0, width, -0.5, 0.5);
            y = map(y, 0, height, -0.5, 0.5);
            data.push(x,y);
        }
        return data;
    }

    update(){
        this.pos.add(this.vel);
        this.vel.mult(0.999);
        
        if ((this.pos.x > width) || (this.pos.x < 0)){
            this.vel.x *= -1; 
        }

        if ((this.pos.y > height) || (this.pos.y < 0)){
           this.vel.y *= -1; 
        }

        if (this.attached){
            let neoVel = this.perp(10);
            this.vel.x = this.direction * neoVel.x;
            this.vel.y = this.direction * neoVel.y;

            if (this.vel.mag() > 60){
                this.vel = this.vel.normalize().mult(40); 
            }
        }

        this.trail[frameCount % this.trailLen] = this.pos;
    }

    getDirection(){
        let diff = p5.Vector.sub(this.attached, this.pos);
        let det = (diff.x * this.vel.y) - (diff.y * this.vel.x);

        return (det > 0) ? -1 : 1; 
    }

    attach(pointList){
        this.attached = this.nearest(pointList);
        this.direction = this.getDirection();
    }

    detatch(){
        this.attached = false;
        if (this.pos.x > width){
            this.pos.x = 10;
        }
        else if (this.pos.x < 0){
            this.pos.x = width - 10;
        }
        if (this.pos.y > height){
            this.pos.y = 10;
        }
        else if (this.pos.y < 0){
            this.pos.y = height - 10;
        }
    }

    perp(multiplier){
        let diff = p5.Vector.sub(this.pos, this.attached);
        let n = diff.normalize();
        n.mult(multiplier);

        return createVector(-n.y, n.x);
    }
    
    nearest(pointList){
        let minD = Infinity;
        let point;
        for (let i = 0; i < pointList.length; i++){
            let d = this.pos.dist(pointList[i]);

            if (d < minD){
                minD = d;
                point = pointList[i];
            }
        }
        return point;
    }

    render(){
        stroke(255);
        circle(this.pos.x, this.pos.y, 10);

        if (this.attached){
            line(this.pos.x, this.pos.y, this.attached.x, this.attached.y);
        }
    }
}

var balls = [];
var ballsData = [];
var me;
var theShader;

function preload() {
     theShader = loadShader("../deployment/koi.vert", "../deployment/koi.frag");
}

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    noCursor();
    // createCanvas(windowWidth, windowHeight);

    me = new Player(200, 200, 5, 4);
    for (let i = 0; i < 6; i++){
        balls[i] = createVector(random()* width,
                                random()* height);
        let x = map(balls[i].x, 0, width, -0.5, 0.5);
        let y = map(balls[i].y, 0, height, -0.5, 0.5);
        ballsData.push(x,y);
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // background(0);
    me.update();
    // me.render();
    for (let i = 0; i < 6; i++){
        stroke(255,0,0);
        circle(balls[i].x, balls[i].y, 5);
    }

    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_frameCount", frameCount)
    theShader.setUniform("u_trail_positions", me.toData());
    theShader.setUniform("u_anchor_positions", ballsData);
    rect(0,0, width, height);
}

function keyPressed(){
    me.attach(balls);
}

function keyReleased(){
    me.detatch();
}
