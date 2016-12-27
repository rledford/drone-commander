import { Point } from './Point';
import { Shape } from './Shape';
import { Bullet } from './Bullet';

export class Gun {
  constructor (owner) {
    this.owner = owner;
    this.fireRate = -1;
    this.lastFired = 0;
  }
  update (dt) {
    this.lastFired += dt;
    if (this.lastFired >= this.fireRate){
      this.lastFired -= this.fireRate;
      this.shoot();
    }
  }
  shoot () {
    //customize this in inherited classes
  }
}

export class PlayerGunLevel_1 extends Gun {
  constructor (owner) {
    //owner should be a PlayerDrone
    super(owner);
    this.fireRate = 0.33;
    //uses an adjustedFireRate to change rate based on the owners/players currentPowerLevel
    this.adjustedFireRate = this.fireRate;
  }

  update (dt) {
    this.lastFired += dt;
    this.adjustedFireRate = this.fireRate / (this.owner.currentPowerLevel+0.25);
    if (this.lastFired >= this.adjustedFireRate){
      this.lastFired -= this.adjustedFireRate;
      this.shoot();
    }
  }

  shoot () {
    let bullet = new Bullet();
    bullet.shape = Shape.FromPoints([
        new Point(0,0),
        new Point(0,-15)
    ]);
    bullet.position.set(this.owner.position);
    bullet.velocity.set({
        x: 0,
        y: -1
    });
    this.owner.bulletGroup.push(bullet);
  }
}

export class PlayerGunLevel_2 extends Gun {
  constructor (owner) {
    super(owner);
    this.fireRate = 0.66;
  }
  shoot(){
    let bulletA = new Bullet();
    let bulletB = new Bullet();
    let shapeA = Shape.FromPoints([
      new Point(0,0),
      new Point(0,-15)
    ], true);
    let shapeB = shapeA.clone();
    bulletA.shape = shapeA;
    bulletA.position.set(this.owner.position).x -= 11;
    bulletA.velocity.y = -1;
    bulletB.shape = shapeB;
    bulletB.position.set(this.owner.position).x += 11;
    bulletB.velocity.y = -1;
    this.owner.bulletGroup.push(bulletA);
    this.owner.bulletGroup.push(bulletB);
  }
}

export class PlayerGunLevel_3 extends Gun {
  constructor (owner) {
    super(owner);
    this.fireRate = 1.33;
  }

  shoot(){
    let bulletA = new Bullet();
    let bulletB;
    let shape = Shape.FromPoints([
      new Point(0,0),
      new Point(0,15)
    ], true);
    bulletA.position.set(this.owner.position);
    bulletA.shape = shape;
    bulletB = bulletA.clone();
    bulletA.velocity.set(Point.FromAngleDegrees(87.5));
    bulletB.velocity.set(Point.FromAngleDegrees(92.5));
    Shape.RotateShape(bulletA.shape, -2.5);
    Shape.RotateShape(bulletB.shape, 2.5);
    this.owner.bulletGroup.push(bulletA);
    this.owner.bulletGroup.push(bulletB);
  }
}

export class PlayerGunLevel_4 extends Gun {
  constructor (owner) {
    super(owner);
    this.fireRate = 0.66;
  }

  shoot(){
    let bulletA = new Bullet();
    let bulletB;
    let shape = Shape.FromPoints([
      new Point(0,0),
      new Point(15,0)
    ], true);
    bulletA.position.set(this.owner.position);
    bulletA.shape = shape;
    bulletB = bulletA.clone();
    bulletA.velocity.set({x: -1, y: 0});
    bulletB.velocity.set({x: 1, y: 0});
    this.owner.bulletGroup.push(bulletA);
    this.owner.bulletGroup.push(bulletB);
  }
}
