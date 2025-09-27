
const drawRotatedText = (ctx, text, coord, rotation) => {
  ctx.save();
  ctx.translate(...coord);
  ctx.rotate(rotation);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export default drawRotatedText;