// Inspired by https://thebookofshaders.com/edit.php#10/ikeda-03.frag - Ikeda Data Stream
// Made for sableRaph's weekly creative challenge 
// #WCCChallenge
// https://www.twitch.tv/sableraph


let streams = [];
let speeds = [];

let NUM_STREAMS = 30;
let MIN_STREAK = 4;
let GAP_MAX = 20
let ts = Array(NUM_STREAMS).fill(0);

function setup() {
	createCanvas(windowWidth, windowHeight);
	for (let i = 0; i < NUM_STREAMS; i++){
		
		let s = round(random(1, 5));
		speeds.push(s);
		
		let acc = [];
		let randCoeff = random(0.5, 1);
		for (let x = 0; x < width; x+=MIN_STREAK){
			if (random() > randCoeff) {
				let gapLen = random(MIN_STREAK, GAP_MAX);
								
				for (let k = 0; k < gapLen; k++){
					acc.push(false);
				}
				x += gapLen;
			}
			else {
				for (let k = 0; k < MIN_STREAK; k++) {
					acc.push(true);
				}
			}
		}
		streams.push(acc);
	}
}

function draw() {
	background(250);
	strokeWeight(6.5);
	strokeCap(SQUARE);
	noFill();
	let i = 0
	
	for (let y = 0; y < height - (height/NUM_STREAMS); y += height/NUM_STREAMS) {
		let begun = true;
		beginShape();
		let stream = streams[i];
		
		let speedMod = map(mouseX, 0, width, 1, 10);
		t = ts[i];
		ts[i] += speeds[i] * round(speedMod);
		
		let shift = y/200 + speedMod;
		let freq = map(mouseY, 0, height, height*0.25, height*0.05);
		let getY = (xVal) => sin(xVal/freq - frameCount/3000 + shift) * height/NUM_STREAMS + y;
		
		for (let x = 0; x < width; x+=1){
			let val = stream[(x + t) % width];
			if (val && begun) {
				vertex(x, getY(x));
			} else if (val && !begun) {
				begun = true;
				beginShape();
				vertex(x, getY(x));
			} else if (!val && begun){
				endShape();
				begun = false;
				
				blendMode(BLEND);
			}
		}
		endShape();
		i += 1;
	}
}

