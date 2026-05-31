import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { liquidPhysics } from '../scene/liquidPhysics';

export const TILT_LERP = 0.05;

export const clampLevel = (v) => Math.max(0.05, Math.min(1, v));

/** Rayons horizontal max du liquide à une hauteur Y (géométrie locale × scale XZ). */
export const sampleLiquidRadiusAtY = (geometry, y, scaleX = 1, scaleZ = 1) => {
  if (!geometry?.attributes?.position) return 0.12;
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const span = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
  const band = Math.max(span * 0.025, 0.008);

  const pos = geometry.attributes.position;
  let maxR = 0;
  let count = 0;

  for (let i = 0; i < pos.count; i++) {
    const vy = pos.getY(i);
    if (Math.abs(vy - y) > band) continue;
    const r = Math.hypot(pos.getX(i) * scaleX, pos.getZ(i) * scaleZ);
    if (r > maxR) maxR = r;
    count++;
  }

  if (count === 0) {
    for (let i = 0; i < pos.count; i++) {
      const vy = pos.getY(i);
      if (vy > y) continue;
      const r = Math.hypot(pos.getX(i) * scaleX, pos.getZ(i) * scaleZ);
      if (r > maxR) maxR = r;
    }
  }

  return Math.max(0.04, maxR * 0.97);
};

/** Fusionne le corps lathe + couvercle horizontal — un seul mesh, plus de rondelle séparée. */
export const mergeLiquidCap = (bodyGeo, capY, radius, segments = 64) => {
  const capGeo = new THREE.CircleGeometry(radius, segments);
  capGeo.rotateX(-Math.PI / 2);
  capGeo.translate(0, capY, 0);

  const merged = mergeGeometries([bodyGeo, capGeo], false);
  if (!merged) return { geometry: bodyGeo, capVertexStart: bodyGeo.attributes.position.count };

  merged.computeVertexNormals();
  const capVertexStart = bodyGeo.attributes.position.count;
  return { geometry: merged, capVertexStart };
};

const _pivot = new THREE.Vector3();
const _v = new THREE.Vector3();
const _euler = new THREE.Euler();

/** Incline les sommets du couvercle (ménisque) autour du centre de surface. */
export const applyMeniscusTilt = (geometry, fillY, capVertexStart, tiltX, tiltZ) => {
  if (!geometry?.attributes?.position || capVertexStart == null) return;

  const pos = geometry.attributes.position;
  if (!geometry.userData._capBase || geometry.userData._capBase.length !== pos.array.length) {
    geometry.userData._capBase = Float32Array.from(pos.array);
  }
  const base = geometry.userData._capBase;

  _pivot.set(0, fillY, 0);
  _euler.set(tiltX, 0, tiltZ);

  for (let i = capVertexStart; i < pos.count; i++) {
    const j = i * 3;
    _v.set(base[j], base[j + 1], base[j + 2]).sub(_pivot);
    _v.applyEuler(_euler);
    _v.add(_pivot);
    pos.array[j] = _v.x;
    pos.array[j + 1] = _v.y;
    pos.array[j + 2] = _v.z;
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
};

export const createMeniscusState = () => ({
  tilt: { x: 0, z: 0 },
  fillPlane: new THREE.Plane(),
  bottomPlane: new THREE.Plane(),
  capPlane: new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  tiltNormal: new THREE.Vector3(0, 1, 0),
  tiltCenter: new THREE.Vector3(),
  euler: new THREE.Euler(),
});

export const stepMeniscus = (
  meniscus,
  { fillY, bodyMinY },
  _delta,
  lerp = TILT_LERP
) => {
  meniscus.tilt.x += (liquidPhysics.tiltX - meniscus.tilt.x) * lerp;
  meniscus.tilt.z += (liquidPhysics.tiltZ - meniscus.tilt.z) * lerp;

  meniscus.euler.set(meniscus.tilt.x, 0, meniscus.tilt.z);
  meniscus.tiltNormal.set(0, 1, 0).applyEuler(meniscus.euler);
  meniscus.tiltCenter.set(0, fillY, 0);

  meniscus.fillPlane.setFromNormalAndCoplanarPoint(
    meniscus.tiltNormal.clone().negate(),
    meniscus.tiltCenter
  );

  meniscus.bottomPlane.setFromNormalAndCoplanarPoint(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, bodyMinY, 0)
  );

  meniscus.capPlane.normal.set(0, -1, 0);
  meniscus.capPlane.constant = fillY;

  return meniscus.tilt;
};

/** Matériau liquide opaque — un seul matériau pour corps + surface */
export const liquidBodyMaterialProps = {
  roughness: 0.12,
  metalness: 0,
  transmission: 0,
  thickness: 0,
  ior: 1.33,
  opacity: 1,
  transparent: false,
  clearcoat: 0.35,
  clearcoatRoughness: 0.12,
  depthWrite: true,
  side: THREE.FrontSide,
};
