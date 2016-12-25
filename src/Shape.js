import { Point } from './Point'

export class Shape{
    constructor(){
        this.points = [];
        this.centroid = new Point();
        this.radius = 0;
        this.range = 0;//centroid to furthest point
        this._scale = 1.0;//should not be changed without setScale
    }

    clone () {
        let shape = new Shape();
        this.points.forEach( (pt) => {
            shape.points.push(pt.clone());
        });
        shape.centroid = this.centroid.clone();
        shape.radius = this.radius;
        shape.range = this.range;
        shape._scale = this.scale;

        return shape;
    }

    scaleTo (scale) {
        //scale is relative to original size so that setting it to 1 will make the shape
        //the same size as it was when it was finalized
        this.points.forEach( (point) => {
            point.set(
                Point.Sub(point, this.centroid)
                .scale(scale/this._scale)
            );
        });
        this._scale = scale;
        return this;
    }

    zeroize () {
        //moves this Shapes points so that its geometric center is at (0, 0)
        //returns 'this' for chaining
        this.points.forEach( (point) => {
            //subtract centroid from all points
            point.sub(this.centroid);
        });
        //set the centroid to (0, 0)
        this.centroid.set({
            x: 0,
            y: 0
        });
        return this;
    }

    finalize () {
        //responsible for calculating the centroid and range of this Shape
        //should be called immediately after setting / changing points
        //if not called before scale, zeroize, etc the results will be unpredictable
        //returns 'this' for chaining
        let dist2 = 0, range2 = 0;

        //calculate centroid
        this.centroid.set({
            x: 0,
            y: 0
        });
        this.points.forEach( (point) => {
            this.centroid.add(point);
        });
        //Point.scale uses multiplication - use inverse of points.length as scale value
        this.centroid.scale(1/this.points.length);

        //find range
        this.points.forEach( (point) => {
            dist2 = Point.Distance2(point, this.centroid);
            range2 = dist2 > range2 ? dist2 : range2;
        });
        this.range = Math.sqrt(range2);

        return this;
    }

    static RotateShape (shape, degrees) {
      let angle = Math.PI/180 * degrees;
      let s = Math.sin(angle);
      let c = Math.cos(angle);
      shape.points.forEach( (point) => {
        point.sub(shape.centroid);
        point.set({
          x: point.x * c - point.y * s,
          y: point.x * s + point.y * c
        });
        point.add(shape.centroid);
      });
    }

    static FromPoints (points, zeroize = false) {
        //returns a finalized Shape with the given points
        if (points.length < 2){
            throw new Error('FromPoints requires 2 or more Points - Try using Shape.Circle(radius)');
        }
        let shape = new Shape();
        //shallow copy points into the points array of the new Shape
        shape.points = points.map( (point) => {
            return new Point(point.x, point.y);
        });
        shape.finalize();

        return zeroize ? shape.zeroize() : shape;
    }

    static Circle (radius = 1) {
        let shape = Shape();
        shape.points = [new Point()];
        shape.range = shape.radius = radius;
        return shape;
    }

    static Triangle (width = 1, height = 1) {
        return Shape.FromPoints([
            new Point(0, 0),
            new Point(width * 0.5, height),
            new Point(width, 0)
        ], true);
    }

    static Rectangle (width = 1, height = 1){
        return new Shape.FromPoints([
            new Point(0, 0),
            new Point(0, height-1),
            new Point(width-1, height-1),
            new Point(width-1, 0)
        ], true);
    }
}
