// adapted from https://github.com/cmweiss/geomagJS/blob/master/geomag.js
// World Magnetic Model: https://www.ncei.noaa.gov/products/world-magnetic-model

import magneticModel from './magnetic-model.js';
import { rad, deg } from './angle.js';
import array from './array.js';

const { sqrt, sin, cos, atan2, abs } = Math;

const c = array(13, () => array(13));
const cd = array(13, () => array(13));
const tc = array(13, () => array(13));
const dp = array(13, () => array(13));
const snorm = array(13, () => array(13));
const sp = array(13);
const cp = array(13);
const fn = array(13);
const fm = array(13);
const pp = array(13);
const k = array(13, () => array(13));
const p = array(13, () => array(13));

const maxord = 12;

sp[0] = 0;
cp[0] = 1;
p[0][0] = 1;
pp[0] = 1;
dp[0][0] = 0;

const a = 6378.137;
const b = 6356.7523142;
const re = 6371.2;
const a2 = a * a;
const b2 = b * b;
const c2 = a2 - b2;
const a4 = a2 * a2;
const b4 = b2 * b2;
const c4 = a4 - b4;

// read World Magnetic Model spherical harmonic coefficients

c[0][0] = 0;
cd[0][0] = 0;

const { epoch, model } = magneticModel;

model.forEach((coefficients) => {
  const { n, m, gnm, hnm, dgnm , dhnm } = coefficients;

  if (m <= n) {
    c[m][n] = gnm;
    cd[m][n] = dgnm;
    
    if (m !== 0) {
      c[n][m - 1] = hnm;
      cd[n][m - 1] = dhnm;
    }
  }
});

// convert Schmidt normalized Gauss coefficients to unnormalized

snorm[0][0] = 1;
fm[0] = 0;

for (let n = 1; n <= maxord; n++) {
  snorm[0][n] = snorm[0][n - 1] * (2 * n - 1) / n;
  let j = 2;

  for (let m = 0, D2 = n - m + 1; D2 > 0; D2--, m++) {
    k[m][n] = (((n - 1) * (n - 1)) - (m * m)) / ((2 * n - 1) * (2 * n - 3));

    if (m > 0) {
      const flnmj = ((n - m + 1) * j) / (n + m);
      snorm[m][n] = snorm[m - 1][n] * sqrt(flnmj);
      j = 1;
      c[n][m - 1] = snorm[m][n] * c[n][m - 1];
      cd[n][m - 1] = snorm[m][n] * cd[n][m - 1];
    }

    c[m][n] = snorm[m][n] * c[m][n];
    cd[m][n] = snorm[m][n] * cd[m][n];
  }

  fn[n] = n + 1;
  fm[n] = n;
}

k[1][1] = 0.0;

const decimalYear = (date) => {
  date = date || new Date();
  const year = date.getUTCFullYear();
  const daysInYear = 365 + (((year % 400 === 0) || (year % 4 === 0 && (year % 100 > 0))) ? 1 : 0);
  const msInYear = daysInYear * 24 * 60 * 60 * 1000;
  return year + (date.valueOf() - Date.UTC(year, 0)) / msInYear;
};

const geomag = (location, date) => {
  const { latitude: glat, longitude: glon, altitude: alt } = location;
  const year = decimalYear(date);
  
  const dt = year - epoch;
  const rlat = rad(glat);
  const rlon = rad(glon);
  const srlon = sin(rlon);
  const srlat = sin(rlat);
  const crlon = cos(rlon);
  const crlat = cos(rlat);
  const srlat2 = srlat * srlat;
  const crlat2 = crlat * crlat;

  sp[1] = srlon;
  cp[1] = crlon;

  // convert from geodetic to spherical coordinates

  const q = sqrt(a2 - c2 * srlat2);
  const q1 = alt * q;
  const q2 = ((q1 + a2) / (q1 + b2)) * ((q1 + a2) / (q1 + b2));
  const ct = srlat / sqrt(q2 * crlat2 + srlat2);
  const st = sqrt(1 - (ct * ct));
  const r2 = (alt * alt) + 2 * q1 + (a4 - c4 * srlat2) / (q * q);
  const r = sqrt(r2);
  const d = sqrt(a2 * crlat2 + b2 * srlat2);
  const ca = (alt + d) / r;
  const sa = c2 * crlat * srlat / (r * d);

  for (let m = 2; m <= maxord; m++) {
    sp[m] = sp[1] * cp[m - 1] + cp[1] * sp[m - 1];
    cp[m] = cp[1] * cp[m - 1] - sp[1] * sp[m - 1];
  }

  const aor = re / r;
  let ar = aor * aor;
  let br = 0;
  let bt = 0;
  let bp = 0;
  let bpp = 0;

  for (let n = 1; n <= maxord; n++) {
    ar = ar * aor;
    
    for (let m = 0, D4 = n + m + 1; D4 > 0; D4--, m++) {

      // compute unnormalized associated Legendre polynomials and derivatives via recursion relations

      if (n === m) {
        p[m][n] = st * p[m - 1][n - 1];
        dp[m][n] = st * dp[m - 1][n - 1] + ct * p[m - 1][n - 1];
      } 
      else if (n === 1 && m === 0) {
        p[m][n] = ct * p[m][n - 1];
        dp[m][n] = ct * dp[m][n - 1] - st * p[m][n - 1];
      } 
      else if (n > 1 && n !== m) {
        if (m > n - 2) { 
          p[m][n - 2] = 0; 
        }
        
        if (m > n - 2) { 
          dp[m][n - 2] = 0; 
        }
        
        p[m][n] = ct * p[m][n - 1] - k[m][n] * p[m][n - 2];
        dp[m][n] = ct * dp[m][n - 1] - st * p[m][n - 1] - k[m][n] * dp[m][n - 2];
      }

      // time adjust the Gauss coefficients

      tc[m][n] = c[m][n] + dt * cd[m][n];

      if (m !== 0) {
        tc[n][m - 1] = c[n][m - 1] + dt * cd[n][m - 1];
      }

      // accumulate terms of the spherical harmonic expansions

      const par = ar * p[m][n];
      let temp1, temp2;

      if (m === 0) {
        temp1 = tc[m][n] * cp[m];
        temp2 = tc[m][n] * sp[m];
      } 
      else {
        temp1 = tc[m][n] * cp[m] + tc[n][m - 1] * sp[m];
        temp2 = tc[m][n] * sp[m] - tc[n][m - 1] * cp[m];
      }

      bt = bt - ar * temp1 * dp[m][n];
      bp += fm[m] * temp2 * par;
      br += fn[n] * temp1 * par;

      // special case: north/south geographic poles

      if (st === 0 && m === 1) {
        if (n === 1) {
          pp[n] = pp[n - 1];
        } 
        else {
          pp[n] = ct * pp[n - 1] - k[m][n] * pp[n - 2];
        }

        const parp = ar * pp[n];
        bpp += (fm[m] * temp2 * parp);
      }
    }
  }

  bp = st === 0 ? bpp : bp / st;

  // rotate magnetic vector components from spherical to geodetic coordinates

  const bx = -bt * ca - br * sa;
  const by = bp;
  const bz = bt * sa - br * ca;

  // compute declination (dec), inclination (dip) and total intensity (ti)

  const bh = sqrt((bx * bx) + (by * by));
  const ti = sqrt((bh * bh) + (bz * bz));
  const dec = deg(atan2(by, bx));
  const dip = deg(atan2(bz, bh));

  // compute magnetic grid variation if the current geodetic position is in the arctic or antarctic
  // (i.e. glat > +55 degrees or glat < -55 degrees) otherwise, set magnetic grid variation to -999.0

  let gv = -999;

  if (abs(glat) >= 55) {
    if (glat > 0 && glon >= 0) {
       gv = dec - glon;
    }

    if (glat > 0 && glon < 0) {
      gv =  dec + abs(glon);
    }

    if (glat < 0 && glon >= 0) {
      gv = dec + glon;
    }

    if (glat < 0 && glon < 0) {
      gv = dec - abs(glon);
    }

    if (gv > 180) {
      gv -= 360;
    }

    if (gv < -180) {
      gv += 360;
    }
  }

  return { declination: dec, inclination: dip, intensity: ti, gridVariation: gv };
  // return { declination: dec, inclination: dip, intensity: ti, gridVariation: gv, bx, by, bz, bh };
};

export default geomag;