import { Point } from './Point';
import { Bullet } from './Bullet';
import { Shape } from './Shape';
import { Drone } from './Drone';
import * as Gun from './Gun';

export class PlayerDrone extends Drone {

    constructor () {
        super();
        this.speed = 500;
        this.velocity = new Point();
        this.destination = new Point();
        this.bulletGroup = null;
        this.shape = PlayerDrone.SHAPE.clone();
        //currentPowerLevel is the index reference in guns[]
        this.currentPowerLevel = 0;
        //the player collects powerups and will gain a powerLevel when nextPaowerLevel is 0
        this.nextPowerLevel = 1;
        this.guns = [
          new Gun.PlayerGunLevel_1(this),
          new Gun.PlayerGunLevel_2(this),
          new Gun.PlayerGunLevel_3(this)
        ];
    }

    update (dt) {
      this.move(dt);
      for (let i = 0; i <= this.currentPowerLevel; i++){
        this.guns[i].update(dt);
      }
    }

    setDestination (pos) {
        if (Point.Distance2(this.position, pos) > this.velocity.mag2()){
            this.destination.set(pos);
        }
    }

    applyPowerup () {
      this.nextPowerLevel--;
      if  (this.nextPowerLevel === 0){
        console.log('POWER LEVEL GAINED');
        this.currentPowerLevel = Math.min(this.currentPowerLevel+1, this.guns.length-1);
        //next power level should be incremental
        //if power level is maxed then there should be a screen wipe or something
        this.nextPowerLevel = Math.min(this.currentPowerLevel + 1, this.guns.length);
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
        for (let i = 0; i <= this.currentPowerLevel; i++){
          this.guns[i].shoot(this.position, this.bulletGroup);
        }
        //this.guns[this.currentPowerLevel].shoot(this.position, this.bulletGroup);
    }
}

PlayerDrone.SHAPE = Shape.FromPoints([
  new Point(0,0),
  new Point(0,-5),
  new Point(5,-11),
  new Point(11,-23),
  new Point(17,-11),
  new Point(23,-5),
  new Point(23,0),
  new Point(11,-5)
], true);
