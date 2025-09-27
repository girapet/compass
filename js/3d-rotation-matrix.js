import angle from './angle.js'

const cosSin = (a) => {
  const θ = angle.rad(a);
  return {
    cosθ: Math.cos(θ),
    sinθ: Math.sin(θ)
  }
}

const identity = () => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const xRotation = (a) => {
  const { cosθ, sinθ } = cosSin(a);
  return [
    [1, 0, 0],
    [0, cosθ, -sinθ],
    [0, sinθ, cosθ]
  ]
};

const yRotation = (a) => {
  const { cosθ, sinθ } = cosSin(a);
  return [
    [cosθ, 0, sinθ],
    [0, 1, 0],
    [-sinθ, 0, cosθ]
  ]
};

const zRotation = (a) => {
  const { cosθ, sinθ } = cosSin(a);
  return [
    [cosθ, -sinθ, 0],
    [sinθ, cosθ, 0],
    [0, 0, 1]
  ]
};

const multiply = (...matrices) => {
  let a = matrices[0];
  let c;

  for (let n = 1; n < matrices.length; n++) {
    const b = matrices[n];
    c = [[], [], []];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
      }
    }

    a = c;
  }

  return c;
}

const vectorMultiply = (m, v) => {
  const [ x, y, z ] = v;
  const w = [];

  for (let i = 0; i < 3; i++) {
    w[i] = m[i][0] * x + m[i][1] * y + m[i][2] * z;
  }

  return w;
};

const inverse = (m) => {
  const [ a, b, c ] = m[0];
  const [ d, e, f ] = m[1];
  const [ g, h, i ] = m[2];

  const a1 = e * i - f * h;
  const b1 = -(d * i - f * g);
  const c1 = d * h - e * g;
  const d1 = -(b * i - c * h);
  const e1 = a * i - c * g;
  const f1 = -(a * h - b * g);
  const g1 = b * f - c * e;
  const h1 = -(a * f - c * d);
  const i1 = a * e - b * d;

  const det = a * a1 + b * b1 + c * c1;
  
  return [
    [a1 / det, d1 / det, g1 / det],
    [b1 / det, e1 / det, h1 / det],
    [c1 / det, f1 / det, i1 / det]
  ];
}

export default { identity, xRotation, yRotation, zRotation, multiply, vectorMultiply, inverse };
