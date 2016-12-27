import { Point } from './Point';
import { Shape } from './Shape';

//this class is intended to be extended
export class GameObject {

    constructor () {
        this.id = GameObject.nextID();//used by GameWorld for object management
        this.world = null;//should be set by a GameWorld when GameWorld.addObject(this) is used
        this.shape = new Shape();
        this.position = new Point();
        this.visible = true;
        this.alive = true;
        this.color = '#fff';
        this.drawStroke = true;
        this.drawFill = true;
        this.drawClosed = true;
        this.lineWidth = 2;
    }

    set (args) {
        for (let k in Object.keys(args)){
            this[k] = args[k];
        }
    }

    update (dt) {
        //dt should be the time passed in seconds
    }

    draw (ctx) {
        ///ctx is a canvas' 2d context
        if (!this.visible) return;
        if (this.shape.points.length >= 2){
            let point = this.shape.points[0],
                x = this.position.x + point.x,
                y = this.position.y + point.y;
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (let i = 1; i < this.shape.points.length; i++){
                point = this.shape.points[i];
                x = this.position.x + point.x;
                y = this.position.y + point.y;
                ctx.lineTo(x, y);
            }
            if (this.drawClosed) {
              ctx.closePath();
            }
            if (this.drawFill){
              ctx.fill();
            }
            if (this.drawStroke){
              ctx.stroke();
            }
        }
        else if (this.shape.points.length === 1){
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.fill();
        }
    }

    static nextID () {
        if (!GameObject.lastID){
            GameObject.lastID = 0;
        }
        return GameObject.lastID++;
    }
}
