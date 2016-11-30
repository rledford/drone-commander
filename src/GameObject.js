import { Point } from './Point';

//this class is intended to be extended
export class GameObject {

    constructor () {
        this.shape = [];
        this.origin = new Point(0,0);
        this.position = new Point(0,0);
        this.size = new Point(1,1);
        this.radius = 1;
        this.visible = false;
        this.alive = true;
    }

    setShape (points) {
        //sets the shape of this Drone and uses the centroid
        //of the vertices as the origin so all rotations are
        //rotated around the center of the shape
        let origin = new Point(0, 0);
        points.forEach( (v) => {
            //sum the points
            origin.x += v.x;
            origin.y += v.y;
        });
        if (points.length >= 2){
            //set the origin as the centroid of the shape
            origin.x /= points.length;
            origin.y /= points.length;
        }
        this.shape = points.map( (point) => {
            //maintain shape but adjust so the centroid is at (0, 0)
            //this way the shape is easier to use for collision and
            //drawing relative to this objects position
            return new Point(point.x - origin.x, point.y - origin.y);
        });
    }

    update (dt) {
        //dt should be the time passed in seconds

    }

    draw (ctx) {
        ///ctx is context
        if (this.shape.length >= 2){
            let x = 0, y = 0, point = this.shape[0];
            ctx.beginPath();
            ctx.fillStyle = this.color;
            x = this.position.x + point.x;
            y = this.position.y + point.y;
            ctx.moveTo(x, y);
            for (let i = 1; i < this.shape.length; i++){
                point = this.shape[i];
                x = this.position.x + point.x;
                y = this.position.y + point.y;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        else if (this.shape.length === 1){
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI*2, true);
            ctx.stroke();
        }
    }
}
