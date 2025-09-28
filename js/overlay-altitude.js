import createTransformer from './create-transformer.js';
import drawRotatedText from './draw-rotated-text.js';

const { atan2, abs } = Math;

const drawAltitude = (ctx, state) => {
  const { polarToScreen, screenToPolar } = createTransformer(ctx, state);

  const [ longitude ] = screenToPolar([ ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 ]);
  const altitude = [];

  for (let lat = -89; lat <= 89; lat++) {
    altitude.push(polarToScreen([longitude, lat]));
  }
  
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#000000';

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff30';
  ctx.beginPath();
  ctx.moveTo(...altitude[0]);

  for (let i = 1; i < altitude.length; i++) {
    ctx.lineTo(...altitude[i]);
  }

  ctx.stroke();    

  ctx.strokeStyle = '#ffffffd0';
  ctx.fillStyle = '#ffffffd0';
  ctx.font = "bold 16px Arial, Helvetica, sans-serif";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  altitude.unshift(polarToScreen([longitude, -90]));

  for (let lat = -89, i = 1; lat <= 89; lat++, i++) {
    const [ x0, y0 ] = altitude[i];
    const [ x1, y1 ] = altitude[i - 1];
    const dx = x0 - x1;
    const dy = y0 - y1;

    const major = lat % 5 === 0;
    const len = major ? 1 : 0.5;

    ctx.beginPath();
    ctx.moveTo(x0 + dy * len, y0 - dx * len);
    ctx.lineTo(x0 - dy * len, y0 + dx * len);
    ctx.stroke();

    if (major && lat) {
      const offset = 1.5;
      const rotation = atan2(dx, -dy);
      const tc = [x0 - dy * offset, y0 + dx * offset];
      drawRotatedText(ctx, `${abs(lat)}`, tc, rotation);
    }
  }
};

export default drawAltitude;