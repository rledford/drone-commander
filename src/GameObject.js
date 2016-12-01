import { Point } from './Point';
import { Shape } from './Shape';

//this class is intended to be extended
export class GameObject {

    constructor () {
        this.shape = new Shape();
        this.position = new Point();
        this.visible = false;
        this.alive = true;
        this.color = '#fff';
    }

    update (dt) {
        //dt should be the time passed in seconds

    }

    draw (ctx) {
        ///ctx is context
        if (this.shape.points.length >= 2){
            let x = 0, y = 0, point = this.shape.points[0];
            ctx.beginPath();
            ctx.fillStyle = this.color;
            x = this.position.x + point.x;
            y = this.position.y + point.y;
            ctx.moveTo(x, y);
            for (let i = 1; i < this.shape.points.length; i++){
                point = this.shape.points[i];
                x = this.position.x + point.x;
                y = this.position.y + point.y;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        else if (this.shape.points.length === 1){
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI*2, true);
            ctx.stroke();
        }
    }
}