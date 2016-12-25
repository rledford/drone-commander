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
      new Point(15,0)
    ], true);
    let shapeB = shapeA.clone();

    bulletA.shape = shapeA;
    bulletA.position.set(this.owner.position);
    bulletA.velocity.set(Point.FromAngleDegrees(-90 - 90));
    bulletB.shape = shapeB;
    bulletB.position.set(this.owner.position);
    bulletB.velocity.set(Point.FromAngleDegrees(90 - 90));
    this.owner.bulletGroup.push(bulletA);
    this.owner.bulletGroup.push(bulletB);
  }
}

export class PlayerGunLevel_3 extends Gun {
  constructor (owner) {
    super(owner);
    this.fireRate = 2.0;
  }

  shoot(){
    let bullet = new Bullet();
    bullet.shape = Shape.FromPoints([
      new Point(0,0),
      new Point(0,-30)
    ]);
    bullet.position.set(this.owner.position);
    bullet.position.add({x: 0, y: 15});
    bullet.velocity.set(Point.FromAngleDegrees(90));
    this.owner.bulletGroup.push(bullet);
  }
}
