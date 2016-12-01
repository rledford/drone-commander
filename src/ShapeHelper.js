import { Point } from './Point';
import { Shape } from './Shape';

//some of the functions have been translated from the C++ source provided at
//http://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

export class ShapeHelper{
    static Orientation (p, q, r) {
        //p is first point of segmentA
        //q is second point of segmentA
        //r is a point from segmentB
        let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0;

        return val > 0 ? 1 : 2;
    }

    static OnSegment (p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)){
                return true;
            }
        return false;
    }

    static DoIntersect (p1, q1, p2, q2){
        //find orientations for general and special cases
        let o1 = ShapeHelper.Orientation(p1, q1, p2);
        let o2 = ShapeHelper.Orientation(p1, q1, q2);
        let o3 = ShapeHelper.Orientation(p2, q2, p1);
        let o4 = ShapeHelper.Orientation(p2, q2, q1);

        //genral case
        if (o1 !== o2 && o3 !== o4){
            return true;
        }
        //special cases
        if (o1 === 0 && ShapeHelper.OnSegment(p1, p2, q1)) return true;
        if (o2 === 0 && ShapeHelper.OnSegment(p1, q2, q1)) return true;
        if (o3 === 0 && ShapeHelper.OnSegment(p2, p1, q2)) return true;
        if (o4 === 0 && ShapeHelper.OnSegment(p2, q1, q2)) return true;

        return false;
    }

    //the following functions assume that the arguments are of type GameObject
    static ObjectsRiskIntersect (a, b){
        let dist2 = Point.Distance2(a.poition, b.position);
        let range2 = Math.pow(a.shape.range + b.shape.range, 2);

        return range2 < dist2;
    }

    static ObjectsIntersect (a, b){

    }

}
