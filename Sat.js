class Sat {
    static testCollision(polygonA, polygonB) {
        var overlap = Math.pow(10, 1000);
        var smallest = new Vector2();
        var axesA = Sat.getAxes(polygonA.pointGlobal);
        var axesB = Sat.getAxes(polygonB.pointGlobal);

        for (let i = 0; i < axesA.length; i++) {
            let projA = Sat.project(axesA[i], polygonA.pointGlobal);
            let projB = Sat.project(axesA[i], polygonB.pointGlobal);

            if (!Sat.overlap(projA, projB)) {
                return null;
            }

            else{
                var o = Sat.overlapDepth(projA, projB);

                if(o < overlap){
                    overlap = o;
                    smallest = axesA[i];
                }
            }
        }

        for (let i = 0; i < axesB.length; i++) {
            let projA = Sat.project(axesB[i], polygonA.pointGlobal);
            let projB = Sat.project(axesB[i], polygonB.pointGlobal);

            if (!Sat.overlap(projA, projB)) {
                return null;
            }

            else{
                var o = Sat.overlapDepth(projA, projB);
                
                if(o < overlap){
                    overlap = o;
                    smallest = axesB[i];
                }
            }
        }

        var mtv = {};
        mtv.smallest = smallest;
        mtv.overlap = overlap;
        
        var ab = polygonB.pos.subtract(polygonA.pos);
        
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


    static getContactPoints(polygonA, polygonB){
        
        var verticesA = polygonA.pointGlobal;
        var verticesB = polygonB.pointGlobal;

        var c1 = new Vector2(0, 0);
        var c2 = new Vector2(0, 0);
        var contactCount = 0;
        var minDist = Math.pow(10, 1000);

        for (let i = 0; i < verticesA.length; i++) {
            var p = verticesA[i];
            
            for (let j = 0; j < verticesA.length; j++){
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

        var contactPoints = {};
        contactPoints.c1 = c1;
        contactPoints.c2 = c2;
        contactPoints.count = contactCount;

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