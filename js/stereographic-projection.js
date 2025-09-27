
const project = (c) => {
  const [ x, y, z ] = c;
  const factor = 1 - z;
  return [
    x / factor,
    y / factor
  ];
};

const unproject = (c) => {
  const [ x, y ] = c;
  const x2y2 = x * x + y * y;
  const factor = x2y2 + 1;
  return [
    2 * x / factor,
    2 * y / factor,
    (x2y2 - 1) / factor
  ];
};

export default { project, unproject }

