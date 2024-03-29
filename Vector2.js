class Vector2 {
  
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
  

    get length() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    get lengthSq() {
      return this.x ** 2 + this.y ** 2;
    }



    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        if (scalar !== 0) {
          return new Vector2(this.x / scalar, this.y / scalar);
        } else {
          return new Vector2();
        }
      }
    
    normalize() {
        const length = this.length;
        if (length !== 0) {
          return new Vector2(this.x / length, this.y / length);
        }
        return new Vector2();
    }

    add(vector) {
      return new Vector2(this.x + vector.x, this.y + vector.y);
    }
  
    subtract(vector) {
      return new Vector2(this.x - vector.x, this.y - vector.y);
    }



    static dot(vector1, vector2) {
      return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static perp(vector){
      return new Vector2(vector.y, -vector.x);
    }

    static rotate(vector, degree){
      var radians = (degree * Math.PI) / 180;
      var cosTheta = Math.cos(radians);
      var sinTheta = Math.sin(radians);
      var x = vector.x * cosTheta - vector.y * sinTheta;
      var y = vector.x * sinTheta + vector.y * cosTheta;

      return new Vector2(x, y);
    }

    static rotateInverse(vector, degree){
      var radians = (degree * Math.PI) / 180;
      var cosTheta = Math.cos(radians);
      var sinTheta = Math.sin(radians);
      var x = vector.x * cosTheta + vector.y * sinTheta;
      var y = vector.x * -sinTheta + vector.y * cosTheta;

      return new Vector2(x, y);
    }

    static nearlyEqualVector(a, b){
        return this.nearlyEqual(a.x, b.x) && this.nearlyEqual(a.y, b.y);
    }

    static nearlyEqual(a, b){
        return Math.abs(a - b) < 0.0001;
    }
      
    static cross(a, b){
      return a.x * b.y - a.y * b.x;
    }
  

}