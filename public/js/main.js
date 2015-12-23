'use strict'

function main() {

  const numPts = 50;
  const ptRadius = 2;
  const minFillRatio = 0.3;
  const lineWidth = 2;
  const ptSplitMultiple = 10;
  const blockDim = new THREE.Vector2(10, 10);
  const moveVec = new THREE.Vector2(0, 10);

  let canvas = document.getElementById('canvas');
  let image = document.getElementById('image');

  let context = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  let points = Point.genInitPoints(numPts, width, height, ptRadius, moveVec,
                                   minFillRatio);
  let cloth = new Cloth(points, lineWidth, moveVec);
  let grid = new Grid(context, width, height, blockDim);

  function render() {
    points = Point.genNewPoints(points, grid, ptSplitMultiple);
    cloth = new Cloth(points, lineWidth);
    grid = new Grid(context, width, height, blockDim);

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0);
    Point.draw(context, points);
    cloth.draw(context);
    // grid.draw(context);

    window.requestAnimationFrame(render);
  }

  render();
}

main();
