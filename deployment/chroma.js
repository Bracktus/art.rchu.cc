
function setup(){
    createCanvas(windowWidth*0.75,300);
}

function draw(){
    blendMode(BLEND);
    background(0);
    blendMode(ADD);
    
    let t = frameCount;
    for (let y = 0; y < height; y+=11){
        for (let x = 0; x < width; x+=11){
            let n = f(x,y,t);
            if (n > 0.9){
                myShape(x, y, 15);
            }
        }
    }
}

function myShape(x, y, r){
    r = r/2;
    fill(255, 0, 0);
    square(x, y ,r);
    fill(0, 255, 0);
    square(x + 4, y, r);
    fill(0, 0, 255);
    square(x + 3, y, r);
}

function f(x,y,t){
    let inMiddle = abs(y - height/2) < 25;
    x = (x-width/2)/100;
    y = (y-height/2)/100;
    t = cos(t/30) * TWO_PI;
    
    a = t / 15;
    if (mouseIsPressed){
        a =+ map(mouseX - width/2, 0, width, 0, PI * 0.4);
    }
    x = x*cos(a) - y*sin(a);
    y = x*sin(a) + y*cos(a);
    let s1 = 1 - abs(sin(x + t) - y);
    let s2 = 1 - abs(cos(x + t + PI * 0.5) - y);
    let s3 = abs(sin(x + t)) >= 0.99 && inMiddle ? 1 : 0;

    return max(s1,s2,s3);
}



