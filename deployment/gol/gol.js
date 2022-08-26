let golShader;
let viewShader;
let canvas;

function preload() {
  golShader = loadShader(
    "/deployment/gol/gol.vert",
    "/deployment/gol/gol.frag"
  );

  viewShader = loadShader(
    "/deployment/gol/gol.vert",
    "/deployment/gol/view.frag"
  );
}

function setup() {

  pixelDensity(1);
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  buffer = createGraphics(width, height, WEBGL);
  buffer.clear();
  buffer.noSmooth();
    
  view = createGraphics(width, height, WEBGL);
  view.clear();
  view.noSmooth();
}

function draw() {

  buffer.shader(golShader);
  buffer.rect(0, 0, width, height);

  golShader.setUniform("u_state", buffer);
  golShader.setUniform("u_resolution", [width, height]);
  golShader.setUniform("u_time", frameCount * 0.01);
  golShader.setUniform(
    "u_mouse",
    [mouseX, height - mouseY].map(v => v * 0.5)
  );

  view.shader(viewShader);
  view.rect(0, 0, width, height);

  viewShader.setUniform("u_state", buffer);
  viewShader.setUniform("u_resolution", [width, height]);
  view._renderer.getTexture(buffer).setInterpolation(NEAREST, NEAREST)

  texture(view);
  rect(-width/2, -height/2, width, height);
}

