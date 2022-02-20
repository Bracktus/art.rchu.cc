function preload() {
     theShader = loadShader("/deployment/metaballs/meta.vert", "/deployment/metaballs/meta.frag")
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

    const mx = mouseX / width;
    const my = mouseY / height;

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_mouse", [mx, my])
    rect(0,0, width, height);
}

