import video from './video.js';
import location from './location.js';
import orientation from './orientation.js';
import overlay from './overlay.js';
import wakeLock from './wake-lock.js';

(async () => {
  const state = { scale: 1500 };

  const $init = document.querySelector('#init');
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

  error = await location.initialize(state);

  if (error) {
    $init.innerHTML = error;
    return;
  }

  // initialize the orientation sensor

  error = orientation.initialize(state);

  if (error) {
    $init.innerHTML = error;
    return;
  }

  // initialize the overlay

  $init.style.setProperty('display', 'none');

  overlay.initialize(state);
  
  // initialize wake lock: keep screen active while in use

  wakeLock.initialize();
})();
