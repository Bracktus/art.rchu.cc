let theShader;

function preload() {
    theShader = loadShader("/deployment/posters/posters.vert", 
                           "/deployment/posters/posters.frag");
}

function setup(){
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    rect(0,0, width, height);
}
