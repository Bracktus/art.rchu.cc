//a js port of https://gist.github.com/Bracktus/e744077e3921e87ab5fe5da30b99c7d3
const BALLS = 7;
const TIME = 40;

class Player {

  constructor(x, y, xVel, yVel){
		this.x = x;
		this.y = y;
		this.xVel = xVel;
		this.yVel = yVel;
		
		this.attached = null;
		this.direction = 1; //Direction is whether we're rotating clockwise or anti clockwise around the ball. 
											  //Either -1 or 1
		this.trailLen = 30;
		this.trailX = [];
		this.trailY = [];
	}
	
	render(){
		noFill();
		stroke(255);
		this.renderTrail();
		if (this.attached != null){
			this.renderAttachment();
		}
	}
	
	update(){
		//apply velocity
		this.x += this.xVel;
		this.y += this.yVel;
		
		//gradual deacceleration
		this.xVel *= 0.999;
		this.yVel *= 0.999;
		
		//bounce the ball off the walls
		if (this.x > width || this.x < 0){
			this.xVel *= -1;
		}
		
		if (this.y > height || this.y < 0){
			this.yVel *= -1;
		}
		
		//when attached, set velocity to the tangent vector of the player and the ball
		if (this.attached != null){
			const [neoXVel, neoYVel] = this.perp(20);
			this.xVel = this.direction * neoXVel;
			this.yVel = this.direction * neoYVel;
			
			//cap velocity
			const velMag = mag(this.xVel, this.yVel);
			if (velMag > 60){
				this.xVel = (this.xVel / velMag) * 61;
				this.yVel = (this.yVel / velMag) * 61;
			}
		}
		
		//store previous positions to render a trail
		const trailIdx = frameCount % this.trailLen;
		this.trailX[trailIdx] = this.x;
		this.trailY[trailIdx] = this.y;
		
	}
	
	getDirection(){
		const v1X = this.attached.x - this.x;
		const v1Y = this.attached.y - this.y;
		const det = (v1X * this.yVel) - (v1Y * this.xVel)
		return (det > 0) ? -1 : 1
	}
	
	attach(points){
		this.attached = this.nearest(points);
		this.direction = this.getDirection();
	}
	
	detatch(){
		this.attached = null;
		if (this.x > width){
			this.x = 10;
		}
		else if (this.x < 0){
			this.x = width - 10;
		}
		
		if (this.y > height){
			this.y = 10;
		}
		else if (this.y < 0){
			this.y = height - 10;
		}
	}
	
	renderTrail(){
		//https://soegaard.github.io/sketching/Examples.html
		//3.3.7 Storing Input
		
		//circle(this.x, this.y, 30);
		const which = frameCount % this.trailLen;
		for (let i = 0; i < this.trailLen; i++){
				let index = (which + 1 + i) % this.trailLen;
				circle(this.trailX[index] || this.x, 
							 this.trailY[index] || this.x, 
							 i/2);
		}
	}
	
	perp(mult){
		//returns the tanget vector between player and ball
		const xDiff =  this.x - this.attached.x;
		const yDiff =  this.y - this.attached.y;
		const d = dist(this.x, this.y, this.attached.x, this.attached.y);
		//Recompute distance every frame because the radius slowly increases.
		//Saving it on attach produces a cool effect where the ball speeds up quickly though.
		
		const xNorm = xDiff / d;
		const yNorm = yDiff / d;
		return [-(mult * yNorm), (mult * xNorm)]
	}
	
	nearest(points){
		const getDist = (point) => dist(this.x, this.y, point.x, point.y);
		let nearest = points[0]
		let nearestD = getDist(nearest);
		
		for (let i = 1; i < points.length; i++){
			let d = getDist(points[i])
			if (d < nearestD){
				nearest = points[i]
				nearestD = d;
			}
		}
		return nearest;
	}
	
	renderAttachment(){
		const a = atan2(this.y - this.attached.y,
										this.x - this.attached.x);
		const x1 = this.attached.x + (this.attached.r / 2) * cos(a);
		const y1 = this.attached.y + (this.attached.r / 2) * sin(a);
		line(x1, y1, this.x, this.y);
	}
}

class BallList {

	constructor(n){
		this.lst = this.initLst(n);
	}
		
	initLst(n){
		let lst = []
		for (let i = 0; i < n; i++){			
			lst[i] = new Ball();
		}
		return lst;
	}
	
	render(){
		for (let i = 0; i < this.lst.length; i++){
			this.lst[i].render();
		}
	}
}

class Ball{

	constructor(){
		this.r = map(random(), 0, 1, 15, 50);
		this.x = map(random(), 0, 1, this.r / 2, width - this.r/2); 
		this.y = map(random(), 0, 1, this.r / 2, height - this.r/2); 
	}

	render(){
		stroke(0, 255, 0);
		noFill();
		circle(this.x,
					 this.y,
					 this.r);
	}
}

class Target {

	constructor(){
		this.x = width * random();
		this.y = height * random();
		this.r = 100;
		this.timesTeleported = 0;
	}
	
	getScore(){
		return this.timesTeleported;
	}
	
	update(playerX, playerY){
		if (this.isInside(playerX, playerY)){
				this.timesTeleported += 1;
				this.teleport();
		}
	}
	
	isInside(x2, y2){
		const xDiff = this.x - x2;
		const yDiff = this.y - y2;
		const xDiffSq = xDiff * xDiff;
		const yDiffSq = yDiff * yDiff;
		
		return xDiffSq + yDiffSq < (this.r / 2) * (this.r / 2) 
	}
	
	teleport(){
		const newX = map(random(), 0, 1, this.r / 2, width - this.r/2); 
		const newY = map(random(), 0, 1, this.r / 2, height - this.r/2); 
		this.x = newX
		this.y = newY
	}
	
	render(){
		stroke(255);
		fill(255);
		circle(this.x, this.y, this.r);
		
		stroke(255, 0, 0);
		fill(255, 0, 0);
		circle(this.x, this.y, this.r * 0.75);
		
		stroke(255);
		fill(255);
		circle(this.x, this.y, this.r * 0.5);
		
		stroke(255, 0, 0);
		fill(255, 0, 0);
		circle(this.x, this.y, this.r * 0.25);
	}
}

class Timer {
	constructor(end){
		this.end = end;
		this.start = 0;
	}
	
	reset(){
		this.start = floor(millis()/1000);
	}
	
	current(){
		return floor(millis()/1000) - this.start;
	}
	
	isOver(){
		return this.current() >= this.end
	}
	
	render(){
		const secs = max(0, this.end - this.current());
		textSize(20);
		fill(255);
		text(secs, 30, 30);
	}
}
let me;
let them;
let targ;
let timer;

function resetGame(){
	timer.reset();
	them = new BallList(BALLS);
	targ = new Target();
}

function setup(){
	//fullscreen();
	createCanvas(windowWidth, windowHeight);
	
	
	background(0)
	me = new Player(150,300, 5, 3);
	them = new BallList(BALLS);
	targ = new Target();
	timer = new Timer(TIME);
	
	targ.teleport();
	
}

function endScreen(){
		fill(255);
		textSize(40);
		textAlign(CENTER, CENTER);
		let str = `Times up!\nScore: ${targ.getScore()}\n Press any button to restart`;
		text(str, width/2, height/2);
}

function draw(){
	background(0);
	noCursor();
	
	if (timer.isOver()){
		endScreen();
	}
	else{
		me.update();
		targ.update(me.x, me.y);
		
		timer.render();
		targ.render();
		them.render();
		me.render();
	}
}

function keyPressed(){
	if (timer.isOver()){
		resetGame();
	}
	
	me.attach(them.lst);
}

function keyReleased(){
	if (!timer.isOver()){
		me.detatch();
	}
}

