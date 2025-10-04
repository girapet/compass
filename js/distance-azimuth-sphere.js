// sources
//   https://en.wikipedia.org/wiki/Great-circle_distance, first formula, spherical law of cosines
//   https://en.wikipedia.org/wiki/Azimuth#In_geodesy

import { deg, rad, rev } from './angle.js';

const { abs, cos, sin, tan, acos, atan2, PI } = Math;

const radius = 6371008.8;
const EPSILON = 0.000000001;  // radians

const distanceAzimuth = (p1, p2) => {
  const { longitude: lon1, latitude: lat1 } = p1;
  const { longitude: lon2, latitude: lat2 } = p2;

  const λ1 = rad(lon1);
  const φ1 = rad(lat1);
  const λ2 = rad(lon2);
  const φ2 = rad(lat2);
  const Δλ = λ2 - λ1;

  const coincident = abs(Δλ) < EPSILON && abs(φ2 - φ1) < EPSILON;
  const antipodal = !coincident && abs(abs(Δλ) - PI) < EPSILON && abs(φ1 + φ2) < EPSILON;

  if (coincident || antipodal) {
    return {};
  }

  const cosφ1 = cos(φ1);
  const sinφ1 = sin(φ1);
  const cosφ2 = cos(φ2);
  const sinφ2 = sin(φ2);
  const tanφ2 = tan(φ2);
  const cosΔλ = cos(Δλ);
  const sinΔλ = sin(Δλ);

  const distance = radius * acos(sinφ1 * sinφ2 + cosφ1 * cosφ2 *  cosΔλ);
  const azimuth = rev(deg(atan2(sinΔλ, cosφ1 * tanφ2 - sinφ1 * cosΔλ)));

  return { distance, azimuth };
};

export default distanceAzimuth;
