class Polygon{

  constructor(pos, points, mass, color) {
    this.pos = pos;
    this.points = points;
    this.rotation = 0;

    this.m = mass;

    this.color = color;

    this.a = new Vector2();
    this.v = new Vector2();
  }


    draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        
        for (let i = 0; i < this.points.length; i++) {
          var pointGlobal = this.pos.add(Vector2.rotate(this.points[i], this.rotation));
          ctx.lineTo(pointGlobal.x, pointGlobal.y);
        }

        ctx.closePath();
        ctx.fill(); 
        
    }


    get pointGlobal(){
        var globalPoints = [];

        for (let i = 0; i < this.points.length; i++) {
          globalPoints.push(this.pos.add(Vector2.rotate(this.points[i], this.rotation)));
        }

        return globalPoints;
    }

}