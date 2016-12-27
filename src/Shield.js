import { GameObject } from './GameObject';

export class Shield extends GameObject {
  constructor (owner) {
    super();
    this.owner = owner;
    this.shape = this.owner.shape.clone().scaleTo(1.33);
    this.color = '#af0';
    this.lineWidth = 1;
    this.drawFill = false;
  }

  update(dt){
    this.position.set(this.owner.position);
  }
}
