var state = 0;

function preload() {
     theShader = loadShader("../deployment/koi.vert", "../deployment/koi.frag");
}

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    noCursor();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("state", state);
    rect(0,0, width, height);
}

function keyPressed(){
    state = (state + 1) % 3;
}


