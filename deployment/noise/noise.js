function preload() {
    theShader = loadShader("/deployment/noise/noise.vert", "/deployment/noise/noise.frag")
}

function setup(){
    pixelDensity(1);
    cnv = createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    shader(theShader);

    const mx = mouseX;
    const my = mouseY; 

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_mouse", [mx, my]);
    rect(0,0, width, height);
}

