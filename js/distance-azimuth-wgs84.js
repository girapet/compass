// sources
//   https://en.wikipedia.org/wiki/Vincenty%27s_formulae#Inverse_problem
//   https://www.movable-type.co.uk/scripts/latlong-vincenty.html

import { deg, rad, rev } from './angle.js';

const { abs, sqrt, cos, sin, tan, atan2, PI } = Math;

const a = 6378137;            // WGS84 semi-major axis
const f = 1 / 298.257223563;  // WGS84 flattening
const b = (1 - f) * a;        // WGS84 semi-minor axis
const a2 = a * a;
const b2 = b * b;

const EPSILON = 0.00000001;  // radians
const MAX_ITERATIONS = 6;

const distanceAzimuth = (p1, p2) => {
  const { longitude: lon1, latitude: lat1 } = p1;
  const { longitude: lon2, latitude: lat2 } = p2;

  const L1 = rad(lon1);
  const φ1 = rad(lat1);
  const L2 = rad(lon2);
  const φ2 = rad(lat2);

  const L = L2 - L1;

  const coincident = abs(L) < EPSILON && abs(φ2 - φ1) < EPSILON;
  const antipodal = !coincident && abs(abs(L) - PI) < EPSILON && abs(φ1 + φ2) < EPSILON;

  if (coincident || antipodal) {
    return {};
  }

  const tanU1 = (1 - f) * tan(φ1);
  const tanU2 = (1 - f) * tan(φ2);

  const cosU1 = 1 / sqrt((1 + tanU1 * tanU1));
  const sinU1 = tanU1 * cosU1;
  const cosU2 = 1 / sqrt((1 + tanU2 * tanU2));
  const sinU2 = tanU2 * cosU2;
 
  let λ = L;
  let λ0;
  let sinσ;
  let cosσ;
  let σ;
  let sinα;
  let cos2α;
  let cos2σm;
  
  let converged;
  let iterations = 0;

  do {
    const cosλ = cos(λ);
    const sinλ = sin(λ);

    sinσ = sqrt((cosU2 * sinλ) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) ** 2);
    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = atan2(sinσ, cosσ);
    sinα = cosU1 * cosU2 * sinλ / sinσ;
    cos2α = 1 - sinα * sinα;
    cos2σm = cos2α ? cosσ - 2 * sinU1 * sinU2 / cos2α : 0;
    const C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));

    λ0 = λ;
    λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));

    converged = abs(λ - λ0) < EPSILON;
  } 
  while (!converged && ++iterations < MAX_ITERATIONS);

  // exit if the loop did not converge to a solution

  if (!converged) {
    return {};
  }

  const u2 = cos2α * (a2 - b2) / b2;
  const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const Δσ = B * sinσ * (cos2σm + B / 4 * (cosσ * (-1 + 2 * cos2σm * cos2σm) - B / 6 * cos2σm * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σm * cos2σm)));

  const distance = b * A * (σ - Δσ);

  const cosλ = cos(λ);
  const sinλ = sin(λ);

  const azimuth = rev(deg(atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ)));

  return { distance, azimuth };
};

export default distanceAzimuth;
