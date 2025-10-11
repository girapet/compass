import environment from './environment.js';
import dom from './dom.js';
import video from './video.js';
import location from './location.js';
import orientation from './orientation.js';
import overlay from './overlay.js';
import wakeLock from './wake-lock.js';
import landmarkManager from './landmark-manager.js';

(async () => {
  const $init = dom.find('#init')[0];
  $init.style.setProperty('display', 'block');  

  // initialize the video from the device's front-facing camera

  $init.innerHTML = 'Starting camera and video ...';

  let error = await video.initialize();

  if (error) {
    $init.innerHTML = error;
    return;
  }

  // initialize the user's location including magentic declination
  
  $init.innerHTML = 'Getting device location, please wait ...';

  error = await location.initialize();

  if (error) {
    $init.innerHTML = error;
    return;
  }

  // initialize the orientation sensor

  error = orientation.initialize();

  if (error) {
    $init.innerHTML = error;
    return;
  }

  // initialize the landmark manager

  landmarkManager.initialize();

  // initialize the overlays

  $init.style.setProperty('display', 'none');

  overlay.initialize();
  
  // only in development: keep screen active while in use

  if (environment === 'development') {
    wakeLock.initialize();
  }
})();
