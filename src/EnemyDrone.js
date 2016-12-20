import { Point } from './Point';
import { Bullet } from './Bullet';
import { Shape } from './Shape';
import { Drone } from './Drone';

export class EnemyDrone extends Drone{

    constructor () {
        super();
        this.fireRate = 0.5;
        this.path = [];
        this.lifetime = 0;
        //this.moveFunction = EnemyDrone.MoveTest(.5, 4);
    }

    set (params) {
        Object.keys(params).forEach( (key) => {
            if (key === 'velocity' || key === 'position' || key === 'shape'){
                this[key] = params[key].clone();
                return;
            }
            this[key] = params[key];
        });
    }

    update (dt) {
      this.lifetime += dt;
      super.update(dt);
    }

    move (dt) {
        if (this.moveFunction){
          this.moveFunction(this);
          //this.moveFunction.update(this, dt);
        }
        super.move(dt);
            /*
        if (Point.Distance(this.position, this.destination) <= 2){
            if (this.path.length > 0){
                this.destination.set(this.path.shift());
            }
        }
        */
    }

    shoot () {
        if (!this.bulletGroup) return;
        let bullet = new Bullet();
        bullet.shape = Shape.FromPoints([
            new Point(0, 0),
            new Point(0, 10)
        ], true);
        bullet.position.set(this.position);
        bullet.speed -= this.velocity.y;
        bullet.velocity.set({
            x: 0,
            y: 1
        });
        this.bulletGroup.push(bullet);
    }

    static MoveSine (obj) {
      let x = obj.moveAmp * Math.cos(obj.moveFreq*obj.lifetime);
      obj.position.add({x: x, y: 0});
    }

    static MoveCircle (obj) {
      let x = obj.moveAmp * Math.cos(obj.moveFreq * obj.lifetime);
      let y = obj.moveAmp * Math.sin(obj.moveFreq * obj.lifetime);
      obj.position.add({
        x: x,
        y: y
      });
    }

    static MoveTest (amp, frequency){
        return {
            amplitude: amp,
            timepassed: 0,
            frequency: frequency,
            update: function (obj, dt) {
                this.timepassed += dt;
                let x, y;
                x = this.amplitude * Math.cos(this.frequency * this.timepassed);
                y = this.amplitude * Math.sin(x*x);
                //let x = Math.sin(2*this.timepassed);
                //let y = Math.sin(3*this.timepassed);
                obj.position.add({
                    x: x,
                    y: y
                });
            }
        }
    }
}

//static property list of Shapes for enemies
EnemyDrone.SHAPES = [
  Shape.FromPoints([
    new Point(49,99),
    new Point(30,79),
    new Point(36,60),
    new Point(36,80),
    new Point(62,80),
    new Point(62,60),
    new Point(68,79)
  ], true)
];
