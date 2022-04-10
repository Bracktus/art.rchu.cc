let prev = []
let canvas;
const TIMER = 0.6;

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', '-1');
    noFill();
    strokeWeight(0.3);
}

function draw(){
    clear()
    prev.push(
      {
        x:mouseX + random(-3, 3), 
        y:mouseY + random(-3, 3),
        timer: TIMER
      }
    );
  
    for (let i = 0; i < prev.length; i++){
      displayLine(prev, i);
    }
}

function displayLine(arr, i){

    let alph = map(arr[i].timer, 0, TIMER, 0, 255);
    stroke(0, 0, 0, alph);
    line(arr[i].x, arr[i].y, mouseX, mouseY);

    arr[i].timer -= 0.03;
    if (arr[i].timer < 0){
      arr.shift();
    }
}
