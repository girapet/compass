import createTransformer from './create-transformer.js';
import distanceAzimuth from './distance-azimuth-sphere.js';
import drawRotatedText from './draw-rotated-text.js';
import { deg } from './angle.js';

const { sqrt, atan2, PI } = Math;

const MIN_DISTANCE = 20;  // meters; mark must be beyond this distance to be visible
const MAX_ALTITUDE_DISTANCE = 50000;  // meters; mark must be within this distance to be plotted with an altitude
const METERS_PER_FOOT = 0.3048;
const METERS_PER_MILE = 5280 * METERS_PER_FOOT;

const overlayMarks = (ctx, state) => {
  const marks = state.marks.filter((m) => m.visible);

  if (!marks.length) {
    return;
  }

  const { polarToScreen } = createTransformer(ctx, state);

  ctx.save();

  ctx.font = "bold 16px Arial, Helvetica, sans-serif";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = '#000000';

  marks.forEach((m) => {
    const { coords } = state.location;
    let { distance, azimuth } = distanceAzimuth(coords, m);

    if (distance && distance >= MIN_DISTANCE) {
      let altitude = 0;

      if (m.elevation !== undefined && distance <= MAX_ALTITUDE_DISTANCE) {
        const Δelevation = m.elevation - coords.altitude;
        altitude = deg(atan2(Δelevation, distance));
        distance = sqrt(distance * distance + Δelevation * Δelevation);
      }

      const [ x0, y0 ] = polarToScreen([azimuth, altitude]);
      const [ x1, y1 ] = polarToScreen([azimuth + 1, altitude]);

      ctx.save();

      ctx.fillStyle = '#ff404080';
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x0, y0, 10, 0, 2 * PI);
      ctx.fill();
      ctx.stroke();

      const customary = distance < METERS_PER_MILE ? `${(distance / METERS_PER_FOOT).toFixed(0)} ft` : `${(distance / METERS_PER_MILE).toFixed(1)} mi`;
      const metric = distance < 1000 ? `${distance.toFixed(0)} m` : `${(distance * 0.001).toFixed(1)} km`;

      const dx = x1 - x0;
      const dy = y1 - y0;
      const rotation = atan2(dy, dx);

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 5;

      drawRotatedText(ctx, `${m.name} ${customary} ${metric}`, [x0, y0], rotation, [12, 0]);

      ctx.restore();
    }
  });
};

export default overlayMarks;