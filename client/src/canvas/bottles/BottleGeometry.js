import * as THREE from 'three';

const createProfile = (points) => {
  const curve = new THREE.SplineCurve(
    points.map(([x, y]) => new THREE.Vector2(x, y))
  );
  return new THREE.LatheGeometry(curve.getPoints(64), 64);
};

export const bottleProfiles = {
  // Classic tapered body — like Chanel No. 5 silhouette
  elegant: () =>
    createProfile([
      [0, -0.5], [0.38, -0.5], [0.42, -0.35], [0.4, 0.2],
      [0.15, 0.45], [0.12, 0.55], [0.14, 0.58], [0.14, 0.58],
    ]),

  // Tall, slender column — haute couture style
  slender: () =>
    createProfile([
      [0, -0.62], [0.18, -0.62], [0.22, -0.48], [0.21, 0.28],
      [0.1, 0.52], [0.08, 0.62], [0.08, 0.64], [0.08, 0.64],
    ]),

  // Wide sphere — bold feminine shape
  round: () =>
    createProfile([
      [0, -0.45], [0.42, -0.42], [0.45, -0.1], [0.44, 0.25],
      [0.2, 0.48], [0.12, 0.55], [0.1, 0.58], [0.1, 0.58],
    ]),

  // Wide vintage flacon — like a Guerlain Shalimar
  vintage: () =>
    createProfile([
      [0, -0.32], [0.42, -0.32], [0.48, -0.12], [0.46, 0.18],
      [0.18, 0.42], [0.12, 0.52], [0.12, 0.54], [0.12, 0.54],
    ]),

  // Rectangular extruded flacon
  square: () => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.35, -0.5);
    shape.lineTo(0.35, -0.5);
    shape.lineTo(0.38, 0.35);
    shape.quadraticCurveTo(0.38, 0.5, 0.15, 0.55);
    shape.lineTo(-0.15, 0.55);
    shape.quadraticCurveTo(-0.38, 0.5, -0.38, 0.35);
    shape.closePath();
    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.7,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4,
    });
    extrude.center();
    extrude.rotateY(Math.PI / 4);
    return extrude;
  },

  // Hexagonal prism — architectural, unisex
  hexagonal: () => {
    const shape = new THREE.Shape();
    const r = 0.34;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();
    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.95,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    extrude.center();
    extrude.rotateX(-Math.PI / 2);
    return extrude;
  },
};

// Approximate inner liquid radius per bottle type (used for surface disk sizing)
export const getLiquidRadius = (bottleType) => {
  const radii = {
    elegant: 0.28,
    slender: 0.15,
    round: 0.32,
    vintage: 0.36,
    square: 0.26,
    hexagonal: 0.26,
  };
  return radii[bottleType] || 0.26;
};
