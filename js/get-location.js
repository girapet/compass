import geomag from './geomag.js';

const getLocation = () => {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((location, error) => {
      if (!error) {
        const { declination } = geomag(location.coords);
        location.declination = declination;
        resolve(location);
      }
      else {
        reject(error);
      }
    });
  });

  return promise;
}

export default getLocation;