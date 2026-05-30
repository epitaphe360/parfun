import * as THREE from 'three';

const ORIGIN = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _dir = new THREE.Vector3();

const H_DIRS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const rayHit = (object3d, y, dx, dz) => {
  ORIGIN.set(0, y, 0);
  _dir.set(dx, 0, dz);
  _raycaster.set(ORIGIN, _dir);
  _raycaster.far = 3;
  _raycaster.firstHitOnly = true;
  const hits = _raycaster.intersectObject(object3d, true);
  return hits.length ? hits[0].distance : null;
};

/** Outer radius — average of 4 horizontal rays (handles oval / ribbed bottles). */
export const sampleBottleRadius = (object3d, y, fallback = 0.18) => {
  if (!object3d) return fallback;
  object3d.updateMatrixWorld(true);

  let sum = 0;
  let count = 0;
  for (const [dx, , dz] of H_DIRS) {
    const d = rayHit(object3d, y, dx, dz);
    if (d != null) { sum += d; count++; }
  }

  if (!count) return fallback;
  return Math.max(0.04, sum / count);
};

/** Inner cavity radius — min of 4 rays, shrunk for glass wall thickness. */
export const sampleBottleInnerRadius = (object3d, y, fallback = 0.18) => {
  if (!object3d) return fallback * 0.55;
  object3d.updateMatrixWorld(true);

  let minDist = Infinity;
  for (const [dx, , dz] of H_DIRS) {
    const d = rayHit(object3d, y, dx, dz);
    if (d != null) minDist = Math.min(minDist, d);
  }

  if (!isFinite(minDist)) return fallback * 0.55;
  return Math.max(0.03, minDist * 0.52);
};

/**
 * Detect neck→cap split Y by finding the narrowest radius in the upper profile.
 * Returns world-space Y for the body/cap clipping plane.
 */
export const detectBodyTopY = (object3d, bottomY, topY, fallbackRatio = 0.72) => {
  const height = topY - bottomY;
  const fallback = bottomY + height * fallbackRatio;
  if (!object3d) return fallback;

  const scanMin = bottomY + height * 0.62;
  const scanMax = bottomY + height * 0.80;
  const STEPS = 24;
  const profile = [];

  for (let i = 0; i <= STEPS; i++) {
    const y = THREE.MathUtils.lerp(scanMin, scanMax, i / STEPS);
    profile.push({ y, r: sampleBottleRadius(object3d, y, 0.2) });
  }

  let minIdx = 0;
  for (let i = 1; i < profile.length; i++) {
    if (profile[i].r < profile[minIdx].r) minIdx = i;
  }

  const splitY = profile[minIdx].y;
  const minY = bottomY + height * 0.65;
  const maxY = bottomY + height * 0.77;
  return THREE.MathUtils.clamp(splitY, minY, maxY);
};
