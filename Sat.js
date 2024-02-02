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
                    smallest = axesA[i];
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
}