import { toRectangular, toPolar } from './coordinate-conversion.js';
import projection from './stereographic-projection.js';
import matrix from './3d-rotation-matrix.js';

const createTransformer = (ctx, rotationMatrix, scale) => {
  const xOffset = ctx.canvas.clientWidth * 0.5;
  const yOffset = ctx.canvas.clientHeight * 0.5;
  const inverseRotationMatrix = matrix.inverse(rotationMatrix);

  const rectangularToScreen = (c) => {
    const c1 = matrix.vectorMultiply(rotationMatrix, c);
    const [ x, y ] = projection.project(c1);
    return [
      x * scale + xOffset,
      y * scale + yOffset
    ];
  }

  const polarToScreen = (c) => rectangularToScreen(toRectangular(c));
  
  const screenToRectangular = (c) => {
    const [ x, y ] = c;
    const c1 = projection.unproject([
      (x - xOffset) / scale,
      (y - yOffset) / scale
    ]);
    return matrix.vectorMultiply(inverseRotationMatrix, c1);
  }

  const screenToPolar = (c) => toPolar(screenToRectangular(c));

  return { polarToScreen, rectangularToScreen, screenToRectangular, screenToPolar };
};

export default createTransformer;