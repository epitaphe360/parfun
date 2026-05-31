import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';
import { easing } from 'maath';

import state from '../../store';
import { buildLiquidLatheGeometry } from '../bottles/BottleGeometry';
import {
  applyMeniscusTilt,
  clampLevel,
  createMeniscusState,
  liquidBodyMaterialProps,
  stepMeniscus,
  TILT_LERP,
} from './liquidMeniscus';

/**
 * Liquide procédural — un seul mesh (corps + couvercle fusionnés).
 * Plus de disque séparé = plus de rondelle flottante.
 */
const PerfumeLiquid = ({
  geometry,
  bottleType,
  isLathe = false,
  basePosition = [0, 0, 0],
  innerScale = 0.86,
  maxLevelScale = 1,
}) => {
  const snap = useSnapshot(state);
  const { gl } = useThree();

  const bodyMatRef = useRef();
  const meshRef = useRef();
  const colorRef = useRef(new THREE.Color(snap.liquidColor));
  const meniscus = useRef(createMeniscusState());

  const level = clampLevel(snap.liquidLevel) * maxLevelScale;

  const latheFill = useMemo(() => {
    if (!isLathe || !bottleType) return null;
    return buildLiquidLatheGeometry(bottleType, level, innerScale);
  }, [isLathe, bottleType, level, innerScale]);

  const bounds = useMemo(() => {
    if (!geometry) return null;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    return geometry.boundingBox.clone();
  }, [geometry]);

  const fillY = latheFill
    ? latheFill.fillY
    : bounds
      ? bounds.min.y + (bounds.max.y - bounds.min.y) * level
      : 0;

  const bodyMinY = latheFill?.minY ?? bounds?.min.y ?? 0;

  useFrame((_, delta) => {
    if (!isLathe) gl.localClippingEnabled = true;

    easing.dampC(colorRef.current, snap.liquidColor, 0.25, delta);

    const tilt = stepMeniscus(
      meniscus.current,
      { fillY, bodyMinY },
      delta,
      TILT_LERP
    );

    if (bodyMatRef.current) {
      bodyMatRef.current.color.copy(colorRef.current);
      if (!isLathe) {
        bodyMatRef.current.clippingPlanes = [
          meniscus.current.bottomPlane,
          meniscus.current.capPlane,
        ];
      }
    }

    if (isLathe && meshRef.current && latheFill?.capVertexStart != null) {
      applyMeniscusTilt(
        meshRef.current.geometry,
        fillY,
        latheFill.capVertexStart,
        tilt.x,
        tilt.z
      );
    }
  });

  if (isLathe) {
    if (!latheFill) return null;
    return (
      <group position={basePosition}>
        <mesh ref={meshRef} geometry={latheFill.geometry} renderOrder={2}>
          <meshPhysicalMaterial
            ref={bodyMatRef}
            color={snap.liquidColor}
            {...liquidBodyMaterialProps}
          />
        </mesh>
      </group>
    );
  }

  if (!geometry || !bounds) return null;

  return (
    <group position={basePosition}>
      <mesh geometry={geometry} scale={[innerScale, 1, innerScale]} renderOrder={2}>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color={snap.liquidColor}
          {...liquidBodyMaterialProps}
        />
      </mesh>
    </group>
  );
};

export default PerfumeLiquid;
