import * as THREE from 'three';

const _raycaster = new THREE.Raycaster();
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();

/**
 * Build a curved label/decal geometry that follows the EXACT bottle surface.
 *
 * For each grid point (u, v):
 *   - u → angle θ around the Y axis (-arc/2 .. +arc/2)
 *   - v → height (yCenter ± height/2)
 *   - raycast (0,y,0)→(sinθ,0,cosθ) → outer radius r at that point
 *   - vertex = (r*offset*sinθ, y, r*offset*cosθ)
 *
 * Result: a curved sheet that hugs the bottle profile (belly + neck), not a
 * cylinder. UV is mapped 0..1 on each axis so the label texture is shown
 * with minimal distortion.
 */
export const buildSurfaceLabel = (
  bottleRoot,
  yCenter,
  height,
  arc,
  { segmentsU = 40, segmentsV = 10, offset = 1.005, fallback = 0.2 } = {}
) => {
  if (!bottleRoot) return null;
  bottleRoot.updateMatrixWorld(true);

  const yMin = yCenter - height / 2;
  const yMax = yCenter + height / 2;
  const thetaStart = -arc / 2;

  const vertices = [];
  const uvs = [];
  const indices = [];

  _raycaster.far = 2;
  _raycaster.firstHitOnly = true;

  for (let j = 0; j <= segmentsV; j++) {
    const v = j / segmentsV;
    const y = THREE.MathUtils.lerp(yMin, yMax, v);

    for (let i = 0; i <= segmentsU; i++) {
      const u = i / segmentsU;
      const theta = thetaStart + u * arc;

      _origin.set(0, y, 0);
      _dir.set(Math.sin(theta), 0, Math.cos(theta));
      _raycaster.set(_origin, _dir);

      const hits = _raycaster.intersectObject(bottleRoot, true);
      const r = (hits.length ? hits[0].distance : fallback) * offset;

      vertices.push(
        r * Math.sin(theta),
        y,
        r * Math.cos(theta),
      );
      // u,v direct — (1-u,1-v) rotated the label 180° on the bottle
      uvs.push(u, v);
    }
  }

  for (let j = 0; j < segmentsV; j++) {
    for (let i = 0; i < segmentsU; i++) {
      const a = j * (segmentsU + 1) + i;
      const b = a + 1;
      const c = a + (segmentsU + 1);
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
};
