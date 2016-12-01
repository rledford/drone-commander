import { Point } from './Point'

export class Shape{
    constructor(){
        this.points = [];
        this.radius = 0;
    }

    centroid () {
        let centroid = new Point();
        this.points.forEach( (point) => {
            centroid.add(point);
        });
        return centroid.scale(1/this.points.length);
    }

    scale (scale) {
        let centroid = this.centroid;
        this.points.forEach( (point) => {
            point.set(
                Point.Sub(point, centroid)
                .normalize()
                .scale(scale)
            );
        });
        return this;
    }

    normalize () {
        //calculate the centeroid of the points and moves its
        //points so that its geometric center is at (0, 0)
        let centroid = this.centroid();
        this.points.forEach( (point) => {
            //subtract centroid from all points
            point.sub(centroid);
        });
        return this;
    }

    static FromPoints (points) {
        let shape = new Shape();
        shape.points = points.map( (point) => {
            return new Point(point.x, point.y);
        });
        return shape;
    }

    static Circle (radius = 1) {
        return Shape.FromPoints([
            new Point()
        ]);
    }

    static Triangle (width = 1, height = 1) {
        return Shape.FromPoints([
            new Point(0, 0),
            new Point(width * 0.5, height),
            new Point(width, 0)
        ]).normalize();
    }

    static Rectangle (width = 1, height = 1){
        return new Shape.FromPoints([
            new Point(0, 0),
            new Point(0, height),
            new Point(width, height),
            new Point(width, 0)
        ]).normalize();
    }
}
