
export class Point {
    constructor (x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    set (point) {
        //set this points coordinates to the values - returns this for chaining
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    clone () {
        return new Point(this.x, this.y);
    }

    mag () {
        return (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    mag2 () {
        //magnitude squared
        return (Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalized () {
        //returns a new Point that represents this Point normalized
        let mag = this.mag();
        return mag !== 0 ? new Point(this.x/mag, this.y/mag) : new Point(this.x, this.y);
    }

    normalize () {
        //normalize this vector in place - returns 'this' for chaining
        let mag = this.mag();
        if (mag !== 0){
            this.x = this.x / mag;
            this.y = this.y / mag;
        }
        return this;
    }

    add (point) {
        //add the point to this point - returns this for chaining
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    sub (point) {
        //subtracts the point from this point - returns this for chaining
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    scale (value) {
        //scales this point - returns this for chaining
        this.x *= value;
        this.y *= value;
        return this;
    }

    equal (point) {
        return this.x === point.x && this.y === point.y;
    }

    toString () {
        return 'Point ('+this.x+', '+this.y+')';
    }

    static Zero () {
        return new Point(0,0);
    }

    static Add (p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }

    static Sub (p1, p2) {
        //subtract p2 from p1
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }

    static Scale (p, scale){
        return new Point(p.x * scale, p.y * scale);
    }

    static Equal (p1, p2){
        return p1.equal(p2);
    }

    static Rotate (p, origin) {
        //origin should be a point or object with x and y properties
        //rotates the point (in place) around the origin
        //returns the point for chaining
        return new Point(0, 0);
    }

    static Distance(p1, p2){
        return Point.Sub(p1, p2).mag();
    }

    static Distance2(p1, p2){
        return Point.Sub(p1, p2).mag2();
    }
}
