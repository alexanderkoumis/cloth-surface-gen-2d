'use strict'

class Grid {

  constructor(context, imgW, imgH, blockDim) {

    this.imgW = imgW;
    this.imgH = imgH;
    this.blockDim = blockDim;
    this.gridDim = this.calcGridPosition(imgW, imgH, blockDim);
    this.data = [].slice.apply(new Int32Array(this.gridDim.x * this.gridDim.y)); 

    let img = context.getImageData(0, 0, imgW, imgH).data;
    for (let gridY = 0; gridY < this.gridDim.y; ++gridY) {
      for (let gridX = 0; gridX < this.gridDim.x; ++gridX) {
        for (let blockY = 0; blockY < this.blockDim.y; ++blockY) {
          for (let blockX = 0; blockX < this.blockDim.x; ++blockX) {
            const y = gridY * this.blockDim.y + blockY;
            const x = gridX * this.blockDim.x + blockX;
            if (y < imgH && x < imgW) {
              const rgb = this.getRGB(img, x, y, imgW);
              if (rgb.r == 0 && rgb.g == 0 && rgb.b == 0) {
                const idx = this.flatIdx(gridX, gridY, this.gridDim.x);
                this.data[idx]++;
              }
            }
          }
        }
      }
    }
  }

  calcGridPosition(x, y, blockDim) {
    return new THREE.Vector2(
      parseInt(x / blockDim.x),
      parseInt(y / blockDim.y)
    );
  }

  calcFillRatio(position) {
    const gridPosition = this.calcGridPosition(
      position.x,
      position.y,
      this.blockDim
    );
    const idx = this.flatIdx(gridPosition.x, gridPosition.y, this.gridDim.x);
    const blockVolumeDense = this.blockDim.x * this.blockDim.y;
    const blockVolumeSparse = this.data[idx];
    const fillRatio = blockVolumeSparse / blockVolumeDense;
    return fillRatio;
  }

  draw(context) {
    let scope = this;
    context.font = '10px';
    this.genGridCoords(true).forEach(gridCoords => {
      context.strokeText(
        scope.data[gridCoords.idx],
        gridCoords.x,
        gridCoords.y
      );
    });
  }
  
  flatIdx(x, y, w) {
    return parseInt(y) * parseInt(w) + parseInt(x);
  }

  genGridCoords(centerCoords) {
    let gridCoords = [];
    let offset = { x: 0, y: 0 };
    if (centerCoords === true) {
      offset.x = this.blockDim.x / 2;
      offset.y = this.blockDim.y / 2;
    }
    for (let gridY = 0; gridY < this.gridDim.y; ++gridY) {
      for (let gridX = 0; gridX < this.gridDim.x; ++gridX) {
        gridCoords.push({
          idx: gridY * this.gridDim.y + gridX,
          x: gridX * this.blockDim.x + offset.x,
          y: gridY * this.blockDim.y + offset.y
        });
      }
    }
    return gridCoords;
  }

  getRGB(imgData, x, y, w) {
    const baseIdx = this.flatIdx(x, y, w) * 4;
    return {
      r: imgData[baseIdx + 0],
      g: imgData[baseIdx + 1],
      b: imgData[baseIdx + 2]
    }
  }

}
