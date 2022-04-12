class Player {
    
    constructor(pos){
        this.pos = pos;
        this.vel = createVector();
        this.attatched = null;
    }

    render(){
        circle(this.pos.x. this.pos.y, 10);
    }

    update(){

        if (keyIsPressed){
            let velAdd = createVector(0,0);
            if 
                case UP_ARROW:
                case 87: //w
                this.vel.add()

                case DOWN_ARROW:
                case 83: //s

                case LEFT_ARROW:
                case 65: //a

                case RIGHT_ARROW:
                case 68: //d
                
            }
        }

        velocity += acceleration * dt;
        position += velocity * dt;
    }
}