
const drawRotatedText = (ctx, text, origin, rotation, offset = [0, 0]) => {
  ctx.save();
  ctx.translate(...origin);
  ctx.rotate(rotation);
  ctx.fillText(text, ...offset);
  ctx.restore();
}

export default drawRotatedText;