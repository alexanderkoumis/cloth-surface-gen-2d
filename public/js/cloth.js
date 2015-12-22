'use strict'

class Cloth {

  constructor(points, lineWidth) {
    this.points = points;
    this.lineWidth = lineWidth;
  }


  draw(context) {
    context.beginPath();
    context.strokeStyle="green"
    for (let i = 0; i < this.points.length; ++i) {
      let position = this.points[i].position; 
      if (i == 0) {
        context.moveTo(position.x, position.y);
      }
      else {
        context.lineTo(position.x, position.y);
      }
    }
    context.stroke();
  }

}
