import { deg, rev } from './angle.js';
import getLocation from './get-location.js';
import matrix from './3d-rotation-matrix.js';
import drawGraticule from './draw-graticule.js';
import drawAzimuth from './draw-azimuth.js';
import drawAltitude from './draw-altitude.js';

(async () => {
  const $init = document.querySelector('#init');
  $init.style.setProperty('display', 'block');  

  // initialize the video from the device's front-facing camera

  $init.innerHTML = 'Starting camera and video...';

  if (!navigator.mediaDevices) {
    $init.innerHTML = 'No camera available';
    return;
  }

  let permission = await navigator.permissions.query({ name: 'camera' });

  if (permission.state === 'denied') {
    $init.innerHTML = 'Permission to use this device\'s camera was denied';
    return;
  }

  const videoOptions = {
    video: { 
      facingMode: { exact: 'environment' },
      width: { ideal: window.innerHeight },
      height: { ideal: window.innerWidth }
    }
  };

  let stream;

  try {
    stream = await navigator.mediaDevices.getUserMedia(videoOptions);
  }
  catch {
    $init.innerHTML = 'No front-facing camera available';
    return;
  }

  const $video = document.querySelector('video');

  if ('srcObject' in $video) {
    $video.srcObject = stream;
  } 
  else {
    $video.src = URL.createObjectURL(stream);
  }

  // initialize the user's location including magentic declination

  permission = await navigator.permissions.query({ name: 'geolocation' });

  if (permission.state === 'denied') {
    $init.innerHTML = 'Permission to use this device\'s location was denied';
    return;
  }

  let location;
  $init.innerHTML = 'Obtaining device location, please wait ...';

  try {
    location = await getLocation();
  }
  catch (error) {
    if (error.code === 1) {
      $init.innerHTML = 'Permission to use this device\'s location was denied';
    }
    else {
      $init.innerHTML = 'Could not obtain a location for this device';
    }

    return;
  }

  setInterval(async () => {
    location = await getLocation();
  }, 1000);

  // initialize the orientation sensor

  const HALF_PI = Math.PI * 0.5;

  if (!AbsoluteOrientationSensor)
  {
    $init.innerHTML = 'Orientation sensor is not supported on this device';
    return;
  }

  let rotationMatrix;

  const sensor = new AbsoluteOrientationSensor({ frequency: 30 });
  sensor.onreading = () => {
    const [qx, qy, qz, qw] = sensor.quaternion;

    // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles

    const xy = 2 * (qw * qx + qy * qz);
    const xx = 1 - 2 * (qx * qx + qy * qy);
    const xr = deg(Math.atan2(xy, xx));

    const ysin = 2 * (qw * qy - qz * qx);
    let yr = deg(Math.abs(ysin > 1) ? Math.sign(ysin) * HALF_PI : Math.asin(ysin));

    const zy = 2 * (qw * qz + qx * qy);
    const zx = 1 - 2 * (qy * qy + qz * qz);
    let zr = deg(Math.atan2(zy, zx));

    // adjust for viewing

    yr = 360 - yr;
    zr = rev(zr - 90 - location.declination);

    rotationMatrix = matrix.multiply(matrix.xRotation(xr), matrix.yRotation(yr), matrix.zRotation(zr));
  };

  sensor.start();

  // initialize the canvas

  $init.style.setProperty('display', 'none');

  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  let scale = 1500;

  const update = () => {
    if (rotationMatrix) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      drawGraticule(ctx, rotationMatrix, scale);
      drawAltitude(ctx, rotationMatrix, scale);
      drawAzimuth(ctx, rotationMatrix, scale);
    }

    requestAnimationFrame(update);
  };

  update();

  // initialize wake lock: keep screen active while in use

  permission = await navigator.permissions.query({ name: 'screen-wake-lock' });

  if (permission.state !== 'denied') {
    let wakeLock = await navigator.wakeLock.request('screen');

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        if (!wakeLock) {
          wakeLock = await navigator.wakeLock.request('screen');
          wakeLock.addEventListener('release', () => {
            wakeLock = undefined;
          });
        }
      }
      else {
        if (wakeLock) {
          wakeLock.release();
        }
      }
    });
  }
})();
