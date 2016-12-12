import { Point } from './Point';
import { Bullet } from './Bullet';
import { Shape } from './Shape';
import { Drone } from './Drone';

export class PlayerDrone extends Drone {

    constructor () {
        super();
        this.speed = 500;
        this.velocity = new Point();
        this.destination = new Point();
        this.bulletGroup = null;

        this.lastFired = 0;
        this.fireRate = 0.25;
    }

    setDestination (pos) {
        if (Point.Distance2(this.position, pos) > this.velocity.mag2()){
            this.destination.set(pos);
        }
    }

    move (dt) {
        //move is called in the base Drone classes update method
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

    shoot () {
        if (!this.bulletGroup) return;
        let bullet = new Bullet();
        bullet.shape = Shape.FromPoints([
            new Point(0,0),
            new Point(0,10)

        ], true);
        bullet.position.set(this.position);
        bullet.speed -= this.velocity.y;
        bullet.velocity.set({
            x: 0,
            y: -1
        });
        this.bulletGroup.push(bullet);
    }
}
