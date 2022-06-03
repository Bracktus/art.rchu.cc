//Idea don't fully extend all the straights
let mySound;
const one = [0, 96, 0,
             0, 68, 0,
             0, 21, 0]

const two = [0, 17, 48,
             0,  34, 0,
             3,  17, 0];

const three = [0,  1,   48,
               0,  130, 0,
               0,  1,   24];

const four = [0, 96, 0,
              3, 68, 0,   
              0, 4,  0]

const five = [0, 65, 0,
              0, 5,  48,
              0, 18, 0]              

const digMap = {1: one, 2:two, 3:three, 4:four, 5:five};

function preload(){
    soundFormats('mp3');
    mySound = loadSound('deployment/click/click.mp3');
}

function setup(){
    l = min(windowWidth, windowHeight);
    createCanvas(l, l);
    userStartAudio();
    mySound.rate(5.5);
}

function draw(){
    let k = Math.floor((frameCount % 200) / 40) + 1;
    let r = width*0.35;

    if ((frameCount % 40) == 0){
        mySound.play();
    }

    blendMode(BLEND);
    background(0);
    stroke(255);
    noFill();
    grid(width/2 - r, height/2 - r, r, digMap[k]);
}

function grid(cX, cY, r, config){
    //config is an array of 9, 8-bit numbers
    let x, y;
    for (let i = 0; i < 9; i++){
        //middle is (0,0)
        //top left is (-1,-1)
        //you get the point...
        x = cX + r * (i % 3) - 1;
        y = cY + r * Math.floor(i / 3) - 1;
        circle(x, y, r/2);
        block(x, y, r/2, config[i]);
    }
}

function block(cX, cY, r, config){
    //config is an 8-bit number
    let nX, nY, ang;
    let tau = 2*PI;

    stroke(120)
    strokeWeight(2);
    circle(cX, cY, r* 0.9 * sin(frameCount*0.08));

    stroke(255)
    strokeWeight(3);
    strokeCap(10);
    blendMode(ADD);
    for (let i = 0; i < 8; i++){
        ang = -(i * tau)/8; //not sure why minus
        nX = cX + r * cos(ang);
        nY = cY + r * sin(ang);
        if (config & (1 << i)){
            stroke(255, 0, 0);
            line(cX-1.85, cY-1.85, nX-1.85, nY-1.85);
            stroke(0, 255, 0);
            line(cX+0.5, cY+0.5, nX+0.5, nY+0.5);
            stroke(0, 0, 255);
            line(cX+0.4, cY+0.4, nX+0.4, nY+0.4);
        }
    }
    stroke(255)
}


