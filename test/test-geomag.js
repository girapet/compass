// compare console output to values in data/wmm/WMM2025_TestValues.txt

import fs from 'node:fs';
import geomag from '../js/geomag.js';

const padLeft = (s, len) => {
  s = `${s}`;

  while (s.length < len) {
    s = ` ${s}`;
  }

  return s;
}

const toDate = (year) => {
  const baseYear = Math.floor(year);
  const daysInYear = 365 + (((baseYear % 400 === 0) || (baseYear % 4 === 0 && (baseYear % 100 > 0))) ? 1 : 0);
  const msInYear = daysInYear * 24 * 60 * 60 * 1000;
  const partialYear = year - baseYear;
  return new Date(Date.UTC(year, 0).valueOf() + partialYear * msInYear);
};

const inputFileName = '../data/wmm/WMM2025_TestValues.txt';
const data = fs.readFileSync(inputFileName, { encoding: 'utf-8' });

data.split('\n').forEach((line) => {
  const values = line.replace(/^\s+|\s+$/g, '').split(/\s+/).map((v) => parseFloat(v));

  if (values.length && !isNaN(values[0])) {
    const [ year, altitude, latitude, longitude ] = values;
    const date = toDate(year);

    const { declination, inclination } = geomag({ latitude, longitude, altitude }, date);
    console.log(`${year.toFixed(1)} ${padLeft(altitude, 3)} ${padLeft(latitude, 4)} ${padLeft(longitude, 5)} ${padLeft(declination.toFixed(2), 8)} ${padLeft(inclination.toFixed(2), 8)}`);

    // const { declination, inclination, intensity, bx, by, bz, bh } = geomag({ latitude, longitude, altitude }, date);
    // console.log(`${year.toFixed(1)} ${padLeft(altitude, 3)} ${padLeft(latitude, 4)} ${padLeft(longitude, 5)} ${padLeft(declination.toFixed(2), 8)} ${padLeft(inclination.toFixed(2), 8)} ${padLeft(bh.toFixed(6), 13)} ${padLeft(bx.toFixed(6), 13)} ${padLeft(by.toFixed(6), 13)} ${padLeft(bz.toFixed(6), 13)} ${padLeft(intensity.toFixed(6), 13)}`);
  }
});
