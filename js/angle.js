
const radiansPerDegree = Math.PI / 180;
const degreesPerRadian = 1 / radiansPerDegree;

export const rad = (x) => x * radiansPerDegree;
export const deg = (x) => x * degreesPerRadian;

export const rev = (x) => {
  x = x % 360;
  return x >= 0 ? x : x + 360;
};

export default { rad, deg, rev }

