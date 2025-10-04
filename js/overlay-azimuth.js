import { toRectangular } from './coordinate-conversion.js';
import createTransformer from './create-transformer.js';
import drawRotatedText from './draw-rotated-text.js';

const { atan2 } = Math;

const baseHorizon = [];
const baseN45 = [];
const baseS45 = [];
const direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

for (let lon = 0; lon < 360; lon++) {
  baseHorizon.push(toRectangular([lon, 0]));
}

baseHorizon.push(baseHorizon[0]);

for (let lon = 0; lon < 360; lon += 45) {
  baseN45.push(toRectangular([lon, 45.5]));
  baseN45.push(toRectangular([lon, 45]));
  baseS45.push(toRectangular([lon, -44.5]));
  baseS45.push(toRectangular([lon, -45]));
}

const overlayAzimuth = (ctx, state) => {
  const { rectangularToScreen } = createTransformer(ctx, state);

  const horizon = baseHorizon.map(rectangularToScreen);
  const n45 = baseN45.map(rectangularToScreen);
  const s45 = baseS45.map(rectangularToScreen);

  ctx.save();

  ctx.strokeStyle = '#ffffffd0';
  ctx.fillStyle = '#ffffffd0';
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#000000';

  for (let lon = 0; lon < 360; lon++) {
    let [ x0, y0 ] = horizon[lon];
    let [ x1, y1 ] = horizon[lon + 1];
    let dx = x1 - x0;
    let dy = y1 - y0;

    const major = lon % 5 === 0;
    const len = major ? 1 : 0.5;
    ctx.beginPath();
    ctx.moveTo(x0 + dy * len, y0 - dx * len);
    ctx.lineTo(x0 - dy * len, y0 + dx * len);
    ctx.stroke();
    
    if (major) {
      ctx.font = "bold 16px Arial, Helvetica, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const offset = 1.5;
      let rotation = atan2(dy, dx);
      let tc = [x0 - dy * offset, y0 + dx * offset];
      drawRotatedText(ctx, `${lon}`, tc, rotation);

      if (lon % 45 === 0) {
        ctx.font = "bold 24px Arial, Helvetica, sans-serif";
        ctx.textBaseline = 'bottom';

        const i = lon / 45;
        const text = `${direction[i]}`;

        tc = [x0 + dy * offset, y0 - dx * offset];
        drawRotatedText(ctx, text, tc, rotation);

        [ x0, y0 ] = n45[i * 2];
        [ x1, y1 ] = n45[i * 2 + 1];
        dx = x1 - x0;
        dy = y1 - y0;

        drawRotatedText(ctx, text, [x0, y0], atan2(-dx, dy));

        [ x0, y0 ] = s45[i * 2];
        [ x1, y1 ] = s45[i * 2 + 1];
        dx = x1 - x0;
        dy = y1 - y0;

        drawRotatedText(ctx, text, [x0, y0], atan2(-dx, dy));
      }
    }
  }

  ctx.restore();
};

export default overlayAzimuth;