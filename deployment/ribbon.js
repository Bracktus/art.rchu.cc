class Particle {
    constructor(pos){
        this.pos = pos;
    }

    update(others){
        let vel;
        let disp = (sin(frameCount / 35) +1) * 0.005;
        //let food = createVector(130*sin(frameCount*0.0151) + width/2 + noise(frameCount/200),
        //                       200*cos(frameCount*0.0102) + height/2);
        
        //let food = createVector(100*cos(noise(frameCount*0.1)) + width/2,
        //                       100*sin(noise(1+frameCount*0.1)) + height/2);
      
        let food = createVector(mouseX, mouseY);
        vel = p5.Vector.sub(this.pos, food).mult(0.05);
        for (let i = 0; i < 200; i++){
            let diff = p5.Vector.sub(this.pos, others[i].pos);
            let dir = diff.normalize();
            
            let f = dir.mult(diff.mag() * disp);
            vel.sub(f);
        }
      
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

let parts = [];

function setup() {
    createCanvas(600, 600);
    background(54,54,54);
    for (let i = 0; i < 200; i++){
      let x = random(width);
      let y = random(height);
      let pos = createVector(x,y)
      parts[i] = new Particle(pos);
    }
}


function draw() {
    let from = color(218, 165, 32);
    let to = color(72, 61, 139);  
    let t = (sin(frameCount / 35) +1)/2
    let inter = lerpColor(from, to, t);
    fill(inter)
    stroke(inter)
    
    for (let i = 0; i < 200; i++){
      let p = parts[i];
      p.update(parts); 
      p.render(); 
    }
}
