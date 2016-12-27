import { GameObject } from './GameObject';
import { Point } from './Point';
import { Shape } from './Shape';

export class Collectable extends GameObject {

  constructor () {
    super();
    this.type = Collectable.TYPE.NONE;
  }

}

export class CollectablePowerup extends Collectable {
  constructor () {
    super();
    this.drawFill = false;
    this.drawClosed = false;
    this.color = '#a564df';
    this.type = Collectable.TYPE.POWERUP;
    this.shape = Shape.FromPoints([
      new Point(23,-17),
      new Point(5,-17),
      new Point(5,-11),
      new Point(17,-11),
      new Point(17,-5),
      new Point(0,-5),
      new Point(0,-23),
      new Point(23,-23),
      new Point(23,0),
      new Point(0,0),
      new Point(0,-5)
    ], true)
  }
}

export class CollectableShield extends Collectable {
  constructor () {
    super();
    this.drawFill = false;
    this.color = '#28ddd2';
    this.type = Collectable.TYPE.SHIELD;
    this.shape = Shape.FromPoints([
      new Point(5,0),
      new Point(11,-21),
      new Point(17,0),
      new Point(0,0),
      new Point(0,-23),
      new Point(23,-23),
      new Point(23,0)
    ], true);
  }
}

Collectable.TYPE = {
  NONE: -1,
  POWERUP: 0,
  SHIELD: 1
}
