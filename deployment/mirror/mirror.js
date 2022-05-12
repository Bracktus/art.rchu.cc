let theShader;
let cam;

function preload() {
    theShader = loadShader("/deployment/mirror/mirror.vert", "/deployment/mirror/mirror.frag")
}

function setup(){
    pixelDensity(1);
    cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    cam = createCapture(VIDEO);
    cam.size(windowWidth, windowHeight);
    cam.hide();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    shader(theShader);

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("tex0", cam);
    rect(0,0, width, height);
}

