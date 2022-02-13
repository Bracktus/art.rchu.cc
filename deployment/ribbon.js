class Particle {
    constructor(pos){
        this.pos = pos;
    }

    update(others){
        let vel;
        let disp = (sin(frameCount / 35) +1) * 0.005;
      
        let food = createVector(mouseX, mouseY);
        vel = p5.Vector.sub(this.pos, food).mult(0.05);
        for (let i = 0; i < 200; i++){
            let diff = p5.Vector.sub(this.pos, others[i].pos);
            let dir = diff.normalize();
            
            let f = dir.mult(diff.mag() * disp);
            vel.sub(f);
        }
        vel.limit(2);
        this.pos.sub(vel);
        //this.clamp();
        
    }
  
    clamp(){
      if (this.pos.x > width){
            this.pos.x = 0;
        }
        else if (this.pos.x < 0){
            this.pos.x = width;
        }
      
        if (this.pos.y > height){
            this.pos.y = 0;
        }
        else if (this.pos.y < 0){
            this.pos.y = height;
        }
    }
    render(){
       point(this.pos.x, this.pos.y); 
    }
}

let cnv;
let parts = [];
let c1;
let c2;

function randomColour(){
    let h = random(360);
    let s = random(50, 90);
    let l = random(40, 90);
    return color(h,s,l);
}

function refresh(){
    for (let i = 0; i < 200; i++){
      //let x = random(width);
      //let y = random(height);
      let pos = createVector(width/2,height/2)
      parts[i] = new Particle(pos);
    }

    c1 = randomColour();
    c2 = randomColour();
}

function setup() {
    colorMode(HSL, 360, 100, 100)
    cnv = createCanvas(windowWidth, windowHeight);
    background(0, 0, 21);
    refresh();
}

function draw() {
    let t = (sin(frameCount / 35) + 1)/2
    let inter = lerpColor(c1, c2, t);

    fill(inter)
    stroke(inter)
    
    for (let i = 0; i < 200; i++){
      let p = parts[i];
      p.update(parts); 
      p.render(); 
    }
}

function mouseClicked(){
  background(0, 0, 21);
  refresh();
}

function windowResized() {
  cnv = resizeCanvas(windowWidth, windowHeight);
  background(0, 0, 21);
}

function keyPressed(){
    if (keyCode === SPACE){
        save(cnv, 'ribbon.jpg');
    }
}
