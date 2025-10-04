// compare console output to result in 
//   https://www.movable-type.co.uk/scripts/latlong.html, Great-circle distance between two points
//   https://www.movable-type.co.uk/scripts/latlong-vincenty.html, Live Examples, Inverse Solution

import distanceAzimuthSphere from '../js/distance-azimuth-sphere.js';
import distanceAzimuthWGS84 from '../js/distance-azimuth-wgs84.js';

const p1 = { longitude: -71, latitude: 42 };
const p2 = { longitude: -72, latitude: 43 };

let result = distanceAzimuthSphere(p1, p2);
console.log('\nSphere');

if (result.distance === undefined) {
  console.log(`  coincident or antipodal points\n`);
}
else {
  console.log(`  Distance: ${result.distance.toFixed(4)} m`);
  console.log(`  Azimuth:  ${result.azimuth.toFixed(3)}°\n`);
}

result = distanceAzimuthWGS84(p1, p2, 'WGS84');
console.log('WGS84');

if (result.distance === undefined) {
  console.log(`  coincident or antipodal points\n`);
}
else {
  console.log(`  Distance: ${result.distance.toFixed(4)} m`);
  console.log(`  Azimuth:  ${result.azimuth.toFixed(3)}°\n`);
}
