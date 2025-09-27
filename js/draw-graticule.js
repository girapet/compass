import { toRectangular } from './coordinate-conversion.js';
import createTransformer from './create-transformer.js';

const graticule = [];

// major longitudes

for (let lon = 0; lon < 360; lon += 90) {
  const coordinates = [];

  for (let lat = -90; lat <= 90; lat++) {
    coordinates.push(toRectangular([lon, lat]));
  }

  graticule.push(coordinates);
}

// minor longitudes

for (let lon = 0; lon < 360; lon += 15) {
  if (lon % 90 > 0) {
    const coordinates = [];

    for (let lat = -75; lat <= 75; lat++) {
      coordinates.push(toRectangular([lon, lat]));
    }

    graticule.push(coordinates);
  }
}

// latitudes

for (let lat = -75; lat <= 75; lat += 15) {
  const coordinates = [];

  for (let lon = 0; lon <= 360; lon++) {
    coordinates.push(toRectangular([lon, lat]));
  }

  graticule.push(coordinates);
}

const drawGraticule = (ctx, rotationMatrix, scale) => {
  const { rectangularToScreen } = createTransformer(ctx, rotationMatrix, scale);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff30';
  ctx.shadowBlur = 0;

  graticule.forEach((coordinates) => {
    coordinates = coordinates.map((c) => rectangularToScreen(c))
    
    ctx.beginPath();
    ctx.moveTo(...coordinates[0]);

    for (let i = 1; i < coordinates.length; i++) {
      ctx.lineTo(...coordinates[i]);
    }

    ctx.stroke();    
  });
};

export default drawGraticule;