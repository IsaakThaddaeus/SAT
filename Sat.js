class Sat {
    static testCollision(pointsA, pointsB) {
        var axesA = Sat.getAxes(pointsA);
        var axesB = Sat.getAxes(pointsB);

        for (let i = 0; i < axesA.length; i++) {
            let projA = Sat.project(axesA[i], pointsA);
            let projB = Sat.project(axesA[i], pointsB);

            if (!Sat.overlap(projA, projB)) {
                return false;

            }
        }

        for (let i = 0; i < axesB.length; i++) {
            let projA = Sat.project(axesB[i], pointsA);
            let projB = Sat.project(axesB[i], pointsB);

            if (!Sat.overlap(projA, projB)) {
                return false;
            }
        }

        return true; 
    }

    static getAxes(points) {
        var axes = [];

        for (let i = 0; i < points.length; i++) {
            let p1 = points[i];
            let p2 = points[i + 1 == points.length ? 0 : i + 1];
            
            let edge = p1.subtract(p2);
            let normal = Vector2.perp(edge);
            axes[i] = normal.normalize();
            console.log(axes[i])
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
}