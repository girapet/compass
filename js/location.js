import geomag from './geomag.js';

const getLocation = () => {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((location) => {
      const { declination } = geomag(location.coords);
      location.declination = declination;
      resolve(location);
    },
    () => resolve());
  });

  return promise;
}

const initialize = async (state) => {
  const permission = await navigator.permissions.query({ name: 'geolocation' });

  if (permission.state === 'denied') {
    return 'Permission to use this device\'s location was denied';
  }

  let location = await getLocation();

  if (!location) {
    return 'Could not get a location for this device';
  }

  state.location = location;
  let intervalHandle;

  const visibilityChangeHandler = () => {
    if (document.visibilityState === 'visible') {
      if (!intervalHandle) {
        intervalHandle = setInterval(async () => {
          location = await getLocation();

          if (location) {
            state.location = location;
          }
        }, 1000);
      }
    }
    else {
      if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = undefined;
      }
    }
  };

  visibilityChangeHandler();

  document.addEventListener('visibilitychange', visibilityChangeHandler);
}

export default { initialize };