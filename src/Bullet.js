import { GameObject } from './GameObject';
import { Point } from './Point';

export class Bullet extends GameObject {

    constructor () {
        super();
        this.color = '#fff';
        this.speed = 500;//px / sec
        this.velocity = new Point(0, 0);
    }

    update(dt){
        this.position.add({
            x: this.velocity.x * this.speed * dt,
            y: this.velocity.y * this.speed * dt
        });
    }

    draw (ctx) {
        super.draw(ctx);
    }
}
