function preload() {
    golShader = loadShader("/deployment/gol/gol.vert", "/deployment/gol/gol.frag");
}

function setup() {
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight, WEBGL);
    buffer = createGraphics(width, height, WEBGL);
    buffer.clear();
    textureMode(NORMAL);

}

function draw() {

    buffer.shader(golShader);
    golShader.setUniform("u_state", buffer);
    golShader.setUniform("u_resolution", [width, height]);
    golShader.setUniform("u_time", frameCount * 0.01);
    golShader.setUniform("u_mouse", [0,0]);
    golShader.setUniform("u_mouse", [mouseX, height - mouseY]);
    buffer.rect(0, 0, width, height);

    image(buffer, width * -0.5, height * -0.5, width, height);
}

