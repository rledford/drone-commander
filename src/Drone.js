import { GameObject } from './GameObject';
import { Point } from './Point';
import { Shape } from './Shape';
import { Bullet } from './Bullet';

export class Drone extends GameObject {

    constructor () {
        super();
        this.speed = 500;//px / sec
        this.velocity = new Point(0, 0);
        this.destination = new Point(0, 0);

        this.bullets = [];
        this.lastFired = 0;
        this.fireRate = 0.1;
    }

    setDestination (pos) {
        if (Point.Distance(this.position, pos) > this.velocity.mag()){
            this.destination.set(pos);
        }
    }

    setPosition (pos){
        //use this to manually set the position otherwise the Drone will
        //continue to move toward the destination
        this.position.set(pos);
        this.destination.set(pos);
    }

    move(dt){
        this.position.add({
            x: this.velocity.x * this.speed * dt,
            y: this.velocity.y * this.speed * dt
        });
    }

    shoot(){
        //override in extended class
    }

    update (dt) {
        let bullet;
        //dt is delta time since last frame
        this.move(dt);
        this.lastFired += dt;
        //update weapons and stuff
        if (this.lastFired >= this.fireRate){
            this.lastFired -= this.fireRate;
            this.shoot();
        }
        for (let i = this.bullets.length-1; i > -1; i--){
            bullet = this.bullets[i];
            bullet.update(dt);
            if (bullet.position.y < -10){
                this.bullets.splice(i, 1);
            }
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
