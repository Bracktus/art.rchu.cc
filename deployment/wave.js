let dots = [];
const layers = 10;
let mic;
let fft;

function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL);
		fft = new p5.FFT();
		userStartAudio();
		mic = new p5.AudioIn();
		mic.start();
		fft.setInput(mic);
}

function draw(){
    background(255);
    stroke(0);
		strokeWeight(4)
    noFill();
    rotateX(0.25*PI);
		rotateZ(frameCount/80);
    let d = 30;
    let x,y,z;
		let spectrum = fft.analyze();
		spectrum.shift();
		spectrum.shift();
		spectrum.shift();
		let i = 0;
    for (let k = 0; k < layers; k++){
      beginShape();
      for (let a = 0; a < 2*PI; a+= 1/k * 0.5){
					
          x = d*k*cos(a);
          y = d*k*sin(a);
          z = k*cos(frameCount/100);
					//z *= noise(x/30,y/30);
					if (i < spectrum.length){
							z += spectrum[i++]*2;
					}
          vertex(x,y,z);
      }
      endShape(CLOSE);
  	}
}

function mousePressed(){

}

