import angle from './angle.js'

const { rad, deg, rev } = angle;
const { cos, sin, atan2 } = Math;

export const toRectangular = (c) => {
  let [ λ, φ ] = c;
  λ = rad(λ);
  φ = rad(φ);

  const cosφ = cos(φ);

  return [
    cos(λ) * cosφ,
    sin(λ) * cosφ,
    sin(φ)
  ];
};

export const toPolar = (c) => {
  const [ x, y, z ] = c;
  return [
    rev(deg(atan2(y, x))),
    deg(atan2(z, Math.sqrt(x * x + y * y)))
  ];
};

export default { toRectangular, toPolar }
