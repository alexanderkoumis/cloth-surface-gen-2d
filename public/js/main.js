'use strict'

function main() {

  const numPts = 50;
  const ptRadius = 2;
  const fillRatio = 0.6;
  const lineWidth = 2;
  const blockDim = new THREE.Vector2(16, 16);
  const moveVec = new THREE.Vector2(0, 5);

  let canvas = document.getElementById('canvas');
  let image = document.getElementById('image');

  let context = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  let points = Point.genInitPoints(numPts, width, height, ptRadius, fillRatio);
  let cloth = new Cloth(points, lineWidth, moveVec);
  let grid = new Grid(context, width, height, blockDim);

  function render() {
    points = Point.genNewPoints(points, grid, moveVec);
    cloth = new Cloth(points, lineWidth);
    grid = new Grid(context, width, height, blockDim);

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0);
    Point.draw(context, points);
    cloth.draw(context);
    // grid.draw();

    window.requestAnimationFrame(render);
  }

  render();
}

main();