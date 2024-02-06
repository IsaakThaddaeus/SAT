class Polygon{

  constructor(pos, points, mass, color) {
    this.pos = pos;
    this.points = points;
    this.rotation = 0;

    this.m = mass;

    this.color = color;

    this.up = new Vector2(0, -75);
    this.forward = new Vector2(75, 0);

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
        
        ctx.strokeStyle = "#9DD973";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.getUp.scale(75).x, this.pos.y + this.getUp.scale(75).y);
        ctx.stroke();

        ctx.strokeStyle = "#2384D9";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.getForward.scale(75).x, this.pos.y + this.getForward.scale(75).y);
        ctx.stroke();
    }


    get pointGlobal(){
        var globalPoints = [];

        for (let i = 0; i < this.points.length; i++) {
          globalPoints.push(this.pos.add(Vector2.rotate(this.points[i], this.rotation)));
        }

        return globalPoints;
    }

    get getForward(){
      return Vector2.rotate(this.forward, this.rotation).normalize();
    }

    get getUp(){
      return Vector2.rotate(this.up, this.rotation).normalize();
    }

}