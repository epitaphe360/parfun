import * as THREE from 'three';

import { mergeLiquidCap } from '../liquid/liquidMeniscus';

export const bottleProfilePoints = {
  elegant: [
    [0, -0.5], [0.38, -0.5], [0.42, -0.35], [0.4, 0.2],
    [0.15, 0.45], [0.12, 0.55], [0.14, 0.58], [0.14, 0.58],
  ],
  slender: [
    [0, -0.62], [0.18, -0.62], [0.22, -0.48], [0.21, 0.28],
    [0.1, 0.52], [0.08, 0.62], [0.08, 0.64], [0.08, 0.64],
  ],
  round: [
    [0, -0.45], [0.42, -0.42], [0.45, -0.1], [0.44, 0.25],
    [0.2, 0.48], [0.12, 0.55], [0.1, 0.58], [0.1, 0.58],
  ],
  vintage: [
    [0, -0.32], [0.42, -0.32], [0.48, -0.12], [0.46, 0.18],
    [0.18, 0.42], [0.12, 0.52], [0.12, 0.54], [0.12, 0.54],
  ],
};

const LATHE_TYPES = new Set(Object.keys(bottleProfilePoints));

const createProfile = (points) => {
  const curve = new THREE.SplineCurve(
    points.map(([x, y]) => new THREE.Vector2(x, y))
  );
  return new THREE.LatheGeometry(curve.getPoints(64), 64);
};

export const isLatheBottleType = (bottleType) => LATHE_TYPES.has(bottleType);

/** Rayon du profil à une hauteur Y (interpolation linéaire entre points). */
export const profileRadiusAtY = (points, y) => {
  if (!points?.length) return 0.12;
  if (y <= points[0][1]) return points[0][0];
  const last = points[points.length - 1];
  if (y >= last[1]) return last[0];

  for (let i = 0; i < points.length - 1; i++) {
    const [r0, y0] = points[i];
    const [r1, y1] = points[i + 1];
    if (y >= y0 && y <= y1) {
      const t = (y - y0) / (y1 - y0 || 1e-6);
      return r0 + (r1 - r0) * t;
    }
  }
  return last[0];
};

const clampLevel = (v) => Math.max(0.05, Math.min(1, v));

/**
 * Volume liquide lathe du fond jusqu'à fillY — section correcte à chaque niveau.
 */
export const buildLiquidLatheGeometry = (bottleType, level, innerScale = 0.86) => {
  const points = bottleProfilePoints[bottleType];
  if (!points) return null;

  const ys = points.map(([, y]) => y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const fillY = minY + (maxY - minY) * clampLevel(level);
  const topR = profileRadiusAtY(points, fillY) * innerScale;

  const STEPS = 48;
  const lathePts = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const y = THREE.MathUtils.lerp(minY, fillY, t);
    const r = profileRadiusAtY(points, y) * innerScale;
    lathePts.push(new THREE.Vector2(Math.max(0.001, r), y - minY));
  }

  const geo = new THREE.LatheGeometry(lathePts, 64);
  geo.translate(0, minY, 0);
  geo.computeVertexNormals();

  const { geometry, capVertexStart } = mergeLiquidCap(geo, fillY, topR);

  return { geometry, fillY, minY, maxY, topRadius: topR, capVertexStart };
};

export const bottleProfiles = {
  elegant: () => createProfile(bottleProfilePoints.elegant),
  slender: () => createProfile(bottleProfilePoints.slender),
  round: () => createProfile(bottleProfilePoints.round),
  vintage: () => createProfile(bottleProfilePoints.vintage),

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
