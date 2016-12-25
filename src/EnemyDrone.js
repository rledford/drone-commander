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
    new Point(0,0),
    new Point(0,-6),
    new Point(6,-12),
    new Point(6,-18),
    new Point(12,-24),
    new Point(18,-18),
    new Point(18,-12),
    new Point(24,-6),
    new Point(24,0),
    new Point(18,-6),
    new Point(6,-6)
  ], true),
  Shape.FromPoints([
    new Point(11,0),
    new Point(0,-17),
    new Point(0,-23),
    new Point(5,-23),
    new Point(5,-17),
    new Point(11,-11),
    new Point(17,-17),
    new Point(17,-23),
    new Point(23,-23),
    new Point(23,-17),
  ], true),
  //wide round point
  Shape.FromPoints([
    new Point(11,0),
    new Point(0,-11),
    new Point(0,-17),
    new Point(5,-23),
    new Point(17,-23),
    new Point(23,-17),
    new Point(23,-11)
  ], true),
  //pointy
  Shape.FromPoints([
    new Point(11,0),
    new Point(5,-11),
    new Point(0,-17),
    new Point(0,-23),
    new Point(11,-17),
    new Point(23,-23),
    new Point(23,-17),
    new Point(17,-11),
  ], true),
  //thin rounded point
  Shape.FromPoints([
    new Point(5,0),
    new Point(0,-11),
    new Point(0,-17),
    new Point(5,-23),
    new Point(11,-17),
    new Point(11,-11)
  ], true),
  //thin pointy
  Shape.FromPoints([
    new Point(5,0),
    new Point(0,-23),
    new Point(5,-17),
    new Point(11,-23)
  ], true)
];
