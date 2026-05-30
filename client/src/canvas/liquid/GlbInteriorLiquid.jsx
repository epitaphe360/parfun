import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';
import { easing } from 'maath';

import state from '../../store';
import { liquidPhysics } from '../scene/liquidPhysics';
import { sampleBottleInnerRadius } from '../hooks/sampleBottleRadius';


const clampLevel = (v) => Math.max(0.05, Math.min(1, v));
const TILT_LERP = 0.055;

const STEPS = 14;

const buildBodyLathe = (bottleRoot, bodyMinY, bodyTopY, fallbackR) => {
  const pts = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const worldY = THREE.MathUtils.lerp(bodyMinY, bodyTopY, t);
    const localY = worldY - bodyMinY;
    const r = sampleBottleInnerRadius(bottleRoot, worldY, fallbackR);
    pts.push(new THREE.Vector2(Math.max(0.02, r), localY));
  }
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.computeVertexNormals();
  return geo;
};

const GlbInteriorLiquid = ({ bottleRoot, bodyTopY: bodyTopYProp, liquidBottomY: liquidBottomYProp }) => {
  const snap = useSnapshot(state);
  const { gl } = useThree();

  const bodyMatRef  = useRef();
  const colorRef    = useRef(new THREE.Color(snap.liquidColor));
  const tiltRef     = useRef({ x: 0, z: 0 });

  // Two clip planes:
  //   fillPlane  – keeps y <= fillY  (controls level, this is the meniscus – tilts)
  //   capPlane   – keeps y <= bodyTopY (hard ceiling so liquid never enters cap)
  const fillPlane  = useRef(new THREE.Plane());
  const capPlane   = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 0));
  const tiltNormal = useRef(new THREE.Vector3(0, 1, 0));
  const tiltCenter = useRef(new THREE.Vector3());

  const fallbackR  = snap.bottleMetrics?.liquidRadius ?? 0.16;
  const bodyMinY   = liquidBottomYProp ?? snap.bottleMetrics?.liquidBottomY ?? 0;
  const bodyMaxY   = bodyTopYProp      ?? snap.bottleMetrics?.liquidTopY    ?? 1;
  const bodySpan   = Math.max(0.01, bodyMaxY - bodyMinY);

  const level   = clampLevel(snap.liquidLevel);
  const fillY   = bodyMinY + bodySpan * level;    // world-space fill height

  const geometry = useMemo(
    () => (bottleRoot ? buildBodyLathe(bottleRoot, bodyMinY, bodyMaxY, fallbackR) : null),
    [bottleRoot, bodyMinY, bodyMaxY, fallbackR]
  );

  useFrame((_, delta) => {
    gl.localClippingEnabled = true;

    easing.dampC(colorRef.current, snap.liquidColor, 0.25, delta);

    tiltRef.current.x += (liquidPhysics.tiltX - tiltRef.current.x) * TILT_LERP;
    tiltRef.current.z += (liquidPhysics.tiltZ - tiltRef.current.z) * TILT_LERP;

    // Tilted fill plane — normal points upward, tilted by orbit inertia
    tiltNormal.current.set(0, 1, 0).applyEuler(
      new THREE.Euler(tiltRef.current.x, 0, tiltRef.current.z)
    );
    tiltCenter.current.set(0, fillY, 0);
    fillPlane.current.setFromNormalAndCoplanarPoint(
      tiltNormal.current.clone().negate(),
      tiltCenter.current
    );

    // Hard cap ceiling
    capPlane.current.constant = bodyMaxY;

    if (bodyMatRef.current) {
      bodyMatRef.current.color.copy(colorRef.current);
      bodyMatRef.current.attenuationColor?.copy(colorRef.current);
      bodyMatRef.current.clippingPlanes = [fillPlane.current, capPlane.current];
      bodyMatRef.current.clipIntersection = false; // AND: must pass BOTH planes
      bodyMatRef.current.needsUpdate = true;
    }

  });

  if (!geometry) return null;

  return (
    <group>
      {/* Full-body lathe — fill level controlled by clip plane, not geometry */}
      <mesh geometry={geometry} position={[0, bodyMinY, 0]} renderOrder={0}>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color={snap.liquidColor}
          roughness={0.08}
          metalness={0}
          transmission={0.1}
          thickness={0.5}
          ior={1.33}
          opacity={0.95}
          transparent
          attenuationColor={snap.liquidColor}
          attenuationDistance={0.3}
          depthWrite
          side={THREE.FrontSide}
          clipShadows
        />
      </mesh>

    </group>
  );
};

export default GlbInteriorLiquid;
