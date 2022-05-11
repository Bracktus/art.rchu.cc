let theShader;
let cam;

function preload() {
    theShader = loadShader("/deployment/mirror/mirror.vert", "/deployment/mirror/mirror.frag")
}

function setup(){
    pixelDensity(1);
    cnv = createCanvas(windowWidth/2, windowHeight, WEBGL);
    noStroke();

    cam = createCapture(VIDEO);
    cam.size(windowWidth/2, windowHeight);
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

function changeSize(event){
    if (event.deltaY > 0){
        rad = min(0.6, rad+0.001);
    }
    else{
        rad = max(0.01, rad-0.001);
    }
}
