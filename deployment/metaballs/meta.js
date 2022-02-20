let rad = 0.001;

function preload() {
    theShader = loadShader("/deployment/metaballs/meta.vert", "/deployment/metaballs/meta.frag")
}

function setup(){
    cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.mouseWheel(changeSize);
    noCursor();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    shader(theShader);

    const mx = (mouseX / width) * (width/height) - 1;
    const my = (mouseY / height) - 0.5;

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_mouse", [mx, my]);
    rect(0,0, width, height);
}

function changeSize(event){
    if (event.deltaY > 0){
        
    }
}
