import { deg, rev } from './angle.js';
import matrix from './3d-rotation-matrix.js';
import dom from './dom.js';

const { atan2, abs, sign, asin } = Math;
const HALF_PI = Math.PI * 0.5;

const initialize = (state) => {
  if (!AbsoluteOrientationSensor) {
    return 'Orientation sensor is not supported on this device';
  }

  const sensor = new AbsoluteOrientationSensor({ frequency: 30 });
  sensor.onreading = () => {
    if (!state.location) {
      return;
    }

    const [qx, qy, qz, qw] = sensor.quaternion;

    // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles

    const xy = 2 * (qw * qx + qy * qz);
    const xx = 1 - 2 * (qx * qx + qy * qy);
    const xr = deg(atan2(xy, xx));

    const ysin = 2 * (qw * qy - qz * qx);
    let yr = deg(abs(ysin > 1) ? sign(ysin) * HALF_PI : asin(ysin));

    const zy = 2 * (qw * qz + qx * qy);
    const zx = 1 - 2 * (qy * qy + qz * qz);
    let zr = deg(atan2(zy, zx));

    // adjust for viewing

    yr = 360 - yr;
    zr = rev(zr - 90 - state.location.declination);

    state.rotationMatrix = matrix.multiply(matrix.xRotation(xr), matrix.yRotation(yr), matrix.zRotation(zr));
  };

  sensor.start();

  const visibilityChangeHandler = () => {
    if (document.visibilityState === 'visible') {
      sensor.start();
    }
    else {
      sensor.stop();
    }
  };

  dom.on(document, 'visibilitychange', visibilityChangeHandler);
};

export default { initialize };
