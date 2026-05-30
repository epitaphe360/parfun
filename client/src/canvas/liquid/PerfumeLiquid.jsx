import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';
import { easing } from 'maath';

import state from '../../store';
import { liquidPhysics } from '../scene/liquidPhysics';

const clampLevel = (v) => Math.max(0.05, Math.min(1, v));

/**
 * Lag factor for the surface tilt — lower = heavier/slower liquid feel.
 * 0.045–0.07 gives a realistic perfume viscosity.
 */
const TILT_LERP = 0.05;

/**
 * PerfumeLiquid — two-part liquid render:
 * 1. Body mesh  : bottle geometry scaled to liquid level, no tilt (static)
 * 2. Surface disk: CircleGeometry at the top of the body, tilts with camera inertia
 *
 * The two-part design is physically correct:
 * the liquid body stays fixed; only the free surface tilts when the bottle is rotated.
 */
const PerfumeLiquid = ({
  geometry,
  basePosition = [0, 0, 0],
  innerScale = 0.86,
  maxLevelScale = 1,
  surfaceRadius = null, // neck radius at fill line — avoids giant belly-sized disk
}) => {
  const snap = useSnapshot(state);

  const bodyMatRef = useRef();
  const surfaceRef = useRef();
  const surfaceMatRef = useRef();
  const colorRef = useRef(new THREE.Color(snap.liquidColor));
  const tiltRef = useRef({ x: 0, z: 0 });

  // Compute bounding box once per geometry change
  const bounds = useMemo(() => {
    if (!geometry) return null;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    return geometry.boundingBox;
  }, [geometry]);

  // ── Derived geometry values ──────────────────────────────────────────────
  const levelScale = clampLevel(snap.liquidLevel) * maxLevelScale;

  // Keep the bottom of the scaled liquid anchored to the bottle's bottom.
  // When levelScale < 1 and min.y != 0, the scale pulls the bottom upward;
  // we compensate by shifting the group down by (min.y * (1 - levelScale)).
  const anchorOffsetY = bounds
    ? bounds.min.y * (1 - levelScale)
    : 0;

  const groupPosition = useMemo(
    () => [basePosition[0], basePosition[1] + anchorOffsetY, basePosition[2]],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [basePosition[0], basePosition[1], basePosition[2], anchorOffsetY]
  );

  // innerScale only narrows the X/Z (radius), NOT the height — height is purely levelScale.
  const bodyScale = [innerScale, levelScale, innerScale];

  // Top of the liquid body in group-local space
  const surfaceLocalY = bounds ? bounds.max.y * levelScale : 0;

  // Disk must match the neck width at fill height, NOT the belly width (max.x)
  const diskRadius = surfaceRadius
    ?? (bounds
      ? Math.min(Math.min(bounds.max.x, bounds.max.z) * innerScale * 0.36, 0.16)
      : 0.14);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    // Smooth color transition
    easing.dampC(colorRef.current, snap.liquidColor, 0.25, delta);

    if (bodyMatRef.current) {
      bodyMatRef.current.color.copy(colorRef.current);
      bodyMatRef.current.attenuationColor.copy(colorRef.current);
      bodyMatRef.current.attenuationDistance = 0.18 + levelScale * 0.28;
      bodyMatRef.current.transmission = Math.max(0.08, 0.42 - levelScale * 0.28);
      bodyMatRef.current.opacity = 0.96;
    }
    if (surfaceMatRef.current) {
      surfaceMatRef.current.color.copy(colorRef.current);
    }

    // Surface inertia tilt — only the disk tilts, the body stays still
    tiltRef.current.x += (liquidPhysics.tiltX - tiltRef.current.x) * TILT_LERP;
    tiltRef.current.z += (liquidPhysics.tiltZ - tiltRef.current.z) * TILT_LERP;

    if (surfaceRef.current) {
      surfaceRef.current.rotation.x = tiltRef.current.x;
      surfaceRef.current.rotation.z = tiltRef.current.z;
    }
  });

  if (!geometry || !bounds) return null;

  const sharedDepthProps = { transparent: true, depthWrite: false };

  return (
    <group position={groupPosition}>
      {/* ── Liquid body ───────────────────────────────────────── */}
      <mesh geometry={geometry} scale={bodyScale} renderOrder={2}>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color={snap.liquidColor}
          roughness={0.06}
          metalness={0}
          transmission={0.25}
          thickness={0.9}
          ior={1.36}
          opacity={0.96}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
          attenuationColor={snap.liquidColor}
          attenuationDistance={0.35}
          side={THREE.DoubleSide}
          {...sharedDepthProps}
        />
      </mesh>

      {/* ── Liquid surface disk — this is the only part that tilts ── */}
      <mesh ref={surfaceRef} position={[0, surfaceLocalY, 0]} renderOrder={3}>
        <circleGeometry args={[diskRadius, 64]} />
        <meshPhysicalMaterial
          ref={surfaceMatRef}
          color={snap.liquidColor}
          roughness={0.005}
          metalness={0}
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.005}
          reflectivity={1}
          side={THREE.DoubleSide}
          {...sharedDepthProps}
        />
      </mesh>
    </group>
  );
};

export default PerfumeLiquid;
