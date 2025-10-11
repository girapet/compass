import landmarkStore from './landmark-store.js';
import createTransformer from './create-transformer.js';
import distanceAzimuth from './distance-azimuth-sphere.js';
import drawRotatedText from './draw-rotated-text.js';
import { deg } from './angle.js';
import state from './state.js';

const { sqrt, atan2, PI } = Math;

const MIN_DISTANCE = 10;  // meters; landmark must be beyond this distance to be visible
const MAX_ALTITUDE_DISTANCE = 50000;  // meters; landmark must be within this distance to be plotted with an altitude
const METERS_PER_FOOT = 0.3048;
const FEET_PER_MILE = 5280;

const overlayMarks = () => {
  const landmarks = landmarkStore.getVisible();

  if (!landmarks.length) {
    return;
  }

  const { canvasContext: ctx } = state;
  const { polarToScreen } = createTransformer();
  const { coords } = state.location;
  const numberFormat = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 });

  ctx.save();

  ctx.font = "bold 24px Arial, Helvetica, sans-serif";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = '#000000';

  landmarks.forEach((lm) => {
    let { distance, azimuth } = distanceAzimuth(coords, lm);

    if (distance && distance >= MIN_DISTANCE) {
      ctx.save();

      let altitude = 0;

      if (lm.elevation !== undefined && distance <= MAX_ALTITUDE_DISTANCE) {
        const Δelevation = lm.elevation - coords.altitude;
        altitude = deg(atan2(Δelevation, distance));
        distance = sqrt(distance * distance + Δelevation * Δelevation);
      }

      const [ x0, y0 ] = polarToScreen([azimuth, altitude]);
      const [ x1, y1 ] = polarToScreen([azimuth + 1, altitude]);

      const dx = x1 - x0;
      const dy = y1 - y0;

      ctx.translate(x0, y0);
      ctx.rotate(atan2(dy, dx));

      ctx.fillStyle = '#ffff8080';
      ctx.strokeStyle = '#ffff80';
      ctx.fillRect(-10, -10, 20, 20);
      ctx.strokeRect(-10, -10, 20, 20);

      let measure;

      if (state.units === 'US/Imperial') {
        distance /= METERS_PER_FOOT;
        measure = distance < FEET_PER_MILE ? `${numberFormat.format(distance)} ft` : `${numberFormat.format(distance / FEET_PER_MILE)} mi`;
      }
      else {
        measure = distance < 1000 ? `${numberFormat.format(distance)} m` : `${numberFormat.format(distance * 0.001)} km`;
      }

      ctx.fillStyle = '#ffff80';
      ctx.shadowBlur = 5;
      ctx.fillText(lm.name, 20, -20);
      ctx.fillText(measure, 20, -6);

      ctx.restore();
    }
  });

  ctx.restore();
};

export default overlayMarks;