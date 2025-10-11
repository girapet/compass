
// state shared between modules

const state = {
  units: 'US/Imperial',       // US/Imperial (feet, miles) or International (meters, kilometers)
  scale: 1500,                // stereographic projection scale, calibrates graticule to video
  location: undefined,        // from GeoLocation API
  rotationMatrix: undefined,  // 3x3 rotation matrix to handle device orientation
  canvasContext: undefined    // CanvasRenderingContext2D
};

export default state;