import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';
import { easing } from 'maath';

import state from '../../store';
import { sampleBottleInnerRadius } from '../hooks/sampleBottleRadius';
import {
  applyMeniscusTilt,
  clampLevel,
  createMeniscusState,
  liquidBodyMaterialProps,
  mergeLiquidCap,
  stepMeniscus,
  TILT_LERP,
} from './liquidMeniscus';

const STEPS = 16;

/** Lathe du fond jusqu'à fillY + couvercle fusionné */
const buildFillLathe = (bottleRoot, bodyMinY, fillY, fallbackR) => {
  const top = Math.max(bodyMinY + 0.01, fillY);
  const pts = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const worldY = THREE.MathUtils.lerp(bodyMinY, top, t);
    const localY = worldY - bodyMinY;
    const r = bottleRoot
      ? sampleBottleInnerRadius(bottleRoot, worldY, fallbackR)
      : fallbackR;
    pts.push(new THREE.Vector2(Math.max(0.02, r * 0.97), localY));
  }

  const bodyGeo = new THREE.LatheGeometry(pts, 48);
  bodyGeo.computeVertexNormals();

  const topR = bottleRoot
    ? sampleBottleInnerRadius(bottleRoot, fillY, fallbackR) * 0.97
    : fallbackR;

  const { geometry, capVertexStart } = mergeLiquidCap(bodyGeo, top - bodyMinY, topR);
  return { geometry, capVertexStart, fillY };
};

const GlbInteriorLiquid = ({ bottleRoot, bodyTopY: bodyTopYProp, liquidBottomY: liquidBottomYProp }) => {
  const snap = useSnapshot(state);

  const bodyMatRef = useRef();
  const meshRef = useRef();
  const colorRef = useRef(new THREE.Color(snap.liquidColor));
  const meniscus = useRef(createMeniscusState());

  const fallbackR = snap.bottleMetrics?.liquidRadius ?? 0.16;
  const bodyMinY = liquidBottomYProp ?? snap.bottleMetrics?.liquidBottomY ?? 0;
  const bodyMaxY = bodyTopYProp ?? snap.bottleMetrics?.liquidTopY ?? 1;
  const bodySpan = Math.max(0.01, bodyMaxY - bodyMinY);

  const level = clampLevel(snap.liquidLevel);
  const fillY = bodyMinY + bodySpan * level;

  const latheData = useMemo(
    () => (bottleRoot ? buildFillLathe(bottleRoot, bodyMinY, fillY, fallbackR) : null),
    [bottleRoot, bodyMinY, fillY, fallbackR]
  );

  useFrame((_, delta) => {
    easing.dampC(colorRef.current, snap.liquidColor, 0.25, delta);

    const tilt = stepMeniscus(
      meniscus.current,
      { fillY, bodyMinY },
      delta,
      TILT_LERP
    );

    if (bodyMatRef.current) {
      bodyMatRef.current.color.copy(colorRef.current);
    }

    if (meshRef.current && latheData?.capVertexStart != null) {
      applyMeniscusTilt(
        meshRef.current.geometry,
        fillY - bodyMinY,
        latheData.capVertexStart,
        tilt.x,
        tilt.z
      );
    }
  });

  if (!latheData) return null;

  return (
    <group>
      <mesh ref={meshRef} geometry={latheData.geometry} position={[0, bodyMinY, 0]} renderOrder={2}>
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color={snap.liquidColor}
          {...liquidBodyMaterialProps}
        />
      </mesh>
    </group>
  );
};

export default GlbInteriorLiquid;
