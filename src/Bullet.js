import { GameObject } from './GameObject';
import { Point } from './Point';

export class Bullet extends GameObject {

    constructor () {
        super();
        this.color = '#fff';
        this.speed = 500;//px / sec
        this.velocity = new Point(0, 0);
        this.lifetime = 2.5;//max time to live before alive is set to false
    }

    update(dt){
        this.position.add({
            x: this.velocity.x * this.speed * dt,
            y: this.velocity.y * this.speed * dt
        });
        this.lifetime -= dt;
        this.alive = this.lifetime > 0;
    }

    draw (ctx) {
        super.draw(ctx);
    }
}
