import overlayGraticule from './overlay-graticule.js';
import overlayAzimuth from './overlay-azimuth.js';
import overlayAltitude from './overlay-altitude.js';
import overlayMarks from './overlay-marks.js';
import dom from './dom.js';

const FRAMES_PER_SECOND = 30;

const initialize = (state) => {
  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const fpsInterval = 1000 / FRAMES_PER_SECOND;

  let animationFrameHandle;
  let lastUpdated = performance.now();

  const update = () => {
    animationFrameHandle = requestAnimationFrame(update);
    
    const now = performance.now();
    const elapsed = now - lastUpdated;

    if (elapsed < fpsInterval) {
      return;
    }

    if (state.rotationMatrix) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      overlayGraticule(ctx, state);
      overlayAltitude(ctx, state);
      overlayAzimuth(ctx, state);
      overlayMarks(ctx, state);
    }

    lastUpdated = now;
  };

  update();

  const visibilityChangeHandler = async () => {
    if (document.visibilityState === 'visible') {
      if (animationFrameHandle === undefined) {
        lastUpdated = performance.now();
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

  dom.on(document, 'visibilitychange', visibilityChangeHandler);
};

export default { initialize };
