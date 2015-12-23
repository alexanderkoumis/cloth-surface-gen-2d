'use strict'

var last = 0;
class Point {

  constructor(position, spacing, radius, moveVec, minFillRatio) {
    this.position = position;
    this.spacing = spacing;
    this.radius = radius;
    this.moveVec = moveVec;
    this.minFillRatio = minFillRatio;
  }

  calcNeighborDistances() {
    let back = this.neighbors.back;
    let front = this.neighbors.front;    
    return {
      back: back ? this.position.distanceTo(back.position) : 0.0,
      front: front ? this.position.distanceTo(front.position) : 0.0
    }
  }

  calcNewPosition(grid) {
    const positionToTry = this.position.clone().add(this.moveVec);
    const fillRatio = grid.calcFillRatio(positionToTry);
    if (fillRatio > this.minFillRatio) {
      return this.position.clone();
    }
    return positionToTry;
  }

  genNewPoint(grid) {
    return new Point(
      this.calcNewPosition(grid),
      this.spacing,
      this.radius,
      this.moveVec,
      this.minFillRatio
    );
  }

  genSplitPoints(ptSplitMultiple) {
    let splitPoints = [];
    let neighborDistances = this.calcNeighborDistances();
    if (neighborDistances.front > this.spacing * ptSplitMultiple) {
      let positionFront = this.neighbors.front.position;
      const deltaY = positionFront.y - this.position.y;
      const deltaX = positionFront.x - this.position.x;
      const angleOrigRad = Math.atan2(deltaY, deltaX);
      const angleSpacingRad = Math.PI / ptSplitMultiple;
      const position = new THREE.Vector2(
        this.position.x + deltaX / 2,
        this.position.y + deltaY / 2
      );
      for (let i = 1; i < ptSplitMultiple; ++i) {
        const angleSplitRad = angleOrigRad + i * angleSpacingRad;
        const moveVec = new THREE.Vector2(
          Math.abs(this.moveVec.y) * Math.cos(angleSplitRad),
          Math.abs(this.moveVec.y) * Math.sin(angleSplitRad)
        );
        let splitPoint = new Point(
          position,
          this.spacing,
          this.radius,
          moveVec,
          this.minFillRatio
        );
        splitPoints.push(splitPoint);
      }
    }
    return splitPoints.reverse();
  }

  static setNeighbors(points) {
    const numPoints = points.length;
    for (let i = 0; i < numPoints; ++i) {
      points[i].neighbors = {
        back : i > 0               ? points[i - 1] : null,
        front: i < (numPoints - 1) ? points[i + 1] : null
      }
    }
  }

  static genInitPoints(numPts, width, height, radius, moveVec, minFillRatio) {
    let points = [];
    const spacing = width / numPts;
    for (let i = 0; i < numPts; ++i) {
      let position = new THREE.Vector2(i * spacing, 5);
      points.push(new Point(position, spacing, radius, moveVec, minFillRatio));
    }
    Point.setNeighbors(points);
    return points;
  }

  static genNewPoints(points, grid, ptSplitMultiple) {
    let newPoints = [];
    points.forEach(point => {
      newPoints.push(point.genNewPoint(grid));
      point.genSplitPoints(ptSplitMultiple).forEach(splitPoint => {
        newPoints.push(splitPoint);
      });
    });
    last = newPoints.length;
    Point.setNeighbors(newPoints);
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
