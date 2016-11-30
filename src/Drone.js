import { GameObject } from './GameObject';
import { Point } from './Point';
import { Bullet } from './Bullet';

export class Drone extends GameObject {

    constructor () {
        super();
        this.color = '#fff';
        this.speed = 500;//px / sec
        this.velocity = new Point(0, 0);
        this.destination = new Point(0, 0);

        this.bullets = [];
        this.lastFired = 0;
        this.fireRate = 100;
    }

    setDestination (pos) {
        if (Point.Distance(this.position, pos) > this.velocity.mag()){
            this.destination.set(pos.x, pos.y);
        }
    }

    setPosition (pos){
        //use this to set the position otherwise the Drone will
        //continue to move toward the destination
        this.position.x = this.destination.x = pos.x;
        this.position.y = this.destination.y = pos.y;
    }

    __move(dt){
        let v2d = Point.Sub(this.destination, this.position),//vector to destination
        dist = v2d.mag(),//distance to destination
        vMag = 0;//will assign the velocity.magnitude after acceleration is added
        if (dist > 0.025){//0.025 is just an arbitrary number that helps make stopping less jumpy
            //accelerate
            this.velocity.add({
                    x: v2d.x * dt,
                    y: v2d.y * dt
                });
            //get velocity magnitude
            vMag = this.velocity.mag();
            if (vMag > this.speed || vMag > dist){
                //clamp the velocity by the smallest whichever is smaller (distance or speed)
                //this will allow the drone to decelerate
                this.velocity.normalize().scale(
                    this.speed > dist ? dist : this.speed
                );
            }

            this.position.x += this.velocity.x * dt;
            this.position.y += this.velocity.y * dt;
        }
        else if (!this.position.equal(this.destination)){
            console.log('stop');
            this.setPosition(this.destination);
        }
    }

    __shoot(){
        let bullet = new Bullet();
        bullet.setShape([
            new Point(0,0),
            new Point(0,5),
            new Point(2,5),
            new Point(2,0)
        ]);
        bullet.position.set(this.position.x, this.position.y);
        bullet.speed -= this.velocity.y;
        bullet.velocity.set(0, -1);
        this.bullets.push(bullet);
    }

    update (dt) {
        let time = Date.now(),
            bullet = null;
        //dt is delta time since last frame
        this.__move(dt);
        //update weapons and stuff
        for (let i = this.bullets.length-1; i > -1; i--){
            bullet = this.bullets[i];
            bullet.update(dt);
            if (bullet.position.y < -10){
                this.bullets.splice(i, 1);
            }
        }
            
        if (time - this.lastFired >= this.fireRate){
            this.lastFired = time;
            this.__shoot();
        }
    }

    draw (ctx) {
        super.draw(ctx);
        this.bullets.forEach( (bullet) => {
            bullet.draw(ctx);
        });
        //DEBUG RENDERING
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI*2,true);
        ctx.stroke();
    }
}
