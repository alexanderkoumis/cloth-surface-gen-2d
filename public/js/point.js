'use strict'

class Point {

  constructor(position, spacing, radius, minFillRatio) {
    this.position = position;
    this.spacing = spacing;
    this.radius = radius;
    this.minFillRatio = minFillRatio;
  }

  calcNewPosition(grid, moveVec) {
    const positionToTry = this.position.clone().add(moveVec);
    const fillRatio = grid.calcFillRatio(positionToTry);
    if (fillRatio > this.minFillRatio) {
      return this.position.clone();
    }
    return positionToTry;
  }

  genNewPoint(grid, moveVec) {
    return new Point(
      this.calcNewPosition(grid, moveVec),
      this.spacing,
      this.radius,
      this.minFillRatio
    );
  }

  static genInitPoints(numPoints, width, height, pointRadius, minFillRatio) {
    let points = [];
    const spacing = width / numPoints;
    for (let i = 0; i < numPoints; ++i) {
      let position = new THREE.Vector2(i * spacing, 5);
      points.push(new Point(position, spacing, pointRadius, minFillRatio));
    }
    for (let i = 0; i < numPoints; ++i) {
      points[i].neighbors = {
        back : i > 0               ? points[i - 1] : null,
        front: i < (numPoints - 1) ? points[i + 1] : null
      }
    }
    return points;
  }

  static genNewPoints(points, grid, moveVec) {
    let newPoints = [];
    points.forEach(point => {
      newPoints.push(point.genNewPoint(grid, moveVec));
    });
    return newPoints;
  }

  static draw(context, points) {
    context.fillStyle = 'green';
    points.forEach(point => {
      context.beginPath();
      context.arc(
        point.position.x,
        point.position.y,
        point.radius, 0, Math.PI*2, true);
      context.fill();
    });
  }

}
