import overlayGraticule from './overlay-graticule.js';
import overlayAzimuth from './overlay-azimuth.js';
import overlayAltitude from './overlay-altitude.js';

const initialize = (state) => {
  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  let animationFrameHandle;

  const update = () => {
    if (state.rotationMatrix) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      overlayGraticule(ctx, state);
      overlayAltitude(ctx, state);
      overlayAzimuth(ctx, state);
    }

    animationFrameHandle = requestAnimationFrame(update);
  };

  update();

  const visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      if (animationFrameHandle === undefined) {
        update();
      }
    }
    else {
      if (animationFrameHandle !== undefined) {
        cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = undefined;
      }
    }
  };

  document.addEventListener('visibilitychange', visibilityChangeHandler);
};

export default { initialize };
