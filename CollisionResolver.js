class CollisionResolver {

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAT (Separating Axis Theorem)
// Implementation based on: 
// * https://dyn4j.org/2010/01/sat/#sat-mtv
// * https://community.onelonecoder.com/2020/09/26/separating-axis-theorem-refinements-and-expansion/
// * https://youtu.be/7Ik2vowGcU0?si=tODrIgXWnE2bL_ER
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    static sat(posA, posB, verticesA, verticesB) {
        var overlap = Math.pow(10, 1000);
        var smallest = new Vector2();
        var axesA = CollisionResolver.getAxes(verticesA);
        var axesB = CollisionResolver.getAxes(verticesB);

        for (let i = 0; i < axesA.length; i++) {
            let projA = CollisionResolver.project(axesA[i], verticesA);
            let projB = CollisionResolver.project(axesA[i], verticesB);

            if (!CollisionResolver.overlap(projA, projB)) {
                return null;
            }

            else{
                var o = CollisionResolver.overlapDepth(projA, projB);

                if(o < overlap){
                    overlap = o;
                    smallest = axesA[i];
                }
            }
        }

        for (let i = 0; i < axesB.length; i++) {
            let projA = CollisionResolver.project(axesB[i], verticesA);
            let projB = CollisionResolver.project(axesB[i], verticesB);

            if (!CollisionResolver.overlap(projA, projB)) {
                return null;
            }

            else{
                var o = CollisionResolver.overlapDepth(projA, projB);
                
                if(o < overlap){
                    overlap = o;
                    smallest = axesB[i];
                }
            }
        }

        var mtv = {};
        mtv.smallest = smallest;
        mtv.overlap = overlap;
        
        var ab = posB.subtract(posA);
        
        if(Vector2.dot(ab, mtv.smallest) < 0){
            mtv.smallest = mtv.smallest.scale(-1);
        }
    
        mtv.resolution = mtv.smallest.scale(overlap);

        return mtv; 
    }

    static getAxes(points) {
        var axes = [];

        for (let i = 0; i < points.length; i++) {
            let p1 = points[i];
            let p2 = points[i + 1 == points.length ? 0 : i + 1];
            
            let edge = p1.subtract(p2);
            let normal = Vector2.perp(edge);
            axes[i] = normal.normalize();
        }

        return axes;
    }

    static project(axis, points){
        let min = Vector2.dot(axis, points[0]);
        let max = min;
       
        for (let i = 1; i < points.length; i++){
            var p = Vector2.dot(axis, points[i]);
           
            if(p < min){
                min = p;
            } 
            
            if (p > max){
            max = p;
            }
        }

        let proj = {};
        proj.min = min;
        proj.max = max;
        return proj;
    }

    static overlap(p1, p2){
        if(p2.max > p1.min && p1.max > p2.min){
            return true;
        }

        return false; 
    }

    static overlapDepth(p1, p2){
        return Math.min(Math.abs(p1.min - p2.max), Math.abs(p1.max - p2.min));
    }



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Identifying Contact Points
// Implementation based on: 
// * https://youtu.be/5gDC1GU3Ivg?si=GAJrw1IFTt5DEJG8
// * https://youtu.be/egmZJU-1zPU?si=wCl38ZT3NFDRI4Nk
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
       
    static getContactPoints(verticesA, verticesB){
        var c1 = new Vector2(0, 0);
        var c2 = new Vector2(0, 0);
        var contactCount = 0;
        var minDist = Math.pow(10, 1000);

        for (let i = 0; i < verticesA.length; i++) {
            var p = verticesA[i];
            
            for (let j = 0; j < verticesB.length; j++){
                var va = verticesB[j];
                var vb = verticesB[(j+1) % verticesB.length];

                var cp = this.lineSegmentPointDistance(p, va, vb);

                if(cp != null)
                {
                    if(Vector2.nearlyEqual(cp.dist, minDist)){
                        if(!Vector2.nearlyEqualVector(cp.pos, c1)){
                            c2 = cp.pos;
                            contactCount = 2;
                        }
                    }
                    
                    else if(cp.dist < minDist)
                    {
                        minDist = cp.dist;
                        contactCount = 1;
                        c1 = cp.pos;
                    }
                }
            }
        }

        for (let i = 0; i < verticesB.length; i++) {
            var p = verticesB[i];
            
            for (let j = 0; j < verticesA.length; j++){
                var va = verticesA[j];
                var vb = verticesA[(j+1) % verticesA.length];

                var cp = this.lineSegmentPointDistance(p, va, vb);

                if(cp != null)
                {
                    if(Vector2.nearlyEqual(cp.dist, minDist)){
                        if(!Vector2.nearlyEqualVector(cp.pos, c1)){
                            c2 = cp.pos;
                            contactCount = 2;
                        }
                    }
                    
                    else if(cp.dist < minDist)
                    {
                        minDist = cp.dist;
                        contactCount = 1;
                        c1 = cp.pos;
                    }
                }
            }
        }

        var contactPoints = [];
        contactPoints.push(c1);

        if(contactCount == 2){
            contactPoints.push(c2);
        }

        return contactPoints;
    }

    static lineSegmentPointDistance(p, a, b){
        var cp = {};

        var ab = b.subtract(a);
        var ap = p.subtract(a);

        var proj = Vector2.dot(ap, ab);
        var abLenSQ = ab.lengthSq;

        var d = proj/ abLenSQ;

        if(d < 1 && d > 0){
            var pos = a.add(ab.scale(d));
            var dist = p.subtract(pos).length;

            cp.pos = pos;
            cp.dist = dist
            return cp;
        }

        return null;
    }

}