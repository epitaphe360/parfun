import { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';

import state from '../../store';

const metalMat = (color, opts = {}) => ({
  color: new THREE.Color(color),
  metalness: opts.metalness ?? 0.88,
  roughness: opts.roughness ?? 0.22,
  envMapIntensity: 1.4,
});

/** Empile les pièces à partir du col du flacon (y = 0 = ouverture). */
export const getPumpDimensions = (r, pumpType = 'collar') => {
  const collarH = r * 0.26;
  const stepH = r * 0.12;
  const housingH = r * 0.58;
  const actuatorH = r * 0.34;
  const buttonH = r * 0.11;

  const parts = [];
  let y = 0;

  if (pumpType === 'collar' || pumpType === 'step') {
    parts.push({
      kind: 'collar',
      y: y + collarH * 0.5,
      h: collarH,
      rTop: r * 1.04,
      rBot: r * 1.0,
    });
    y += collarH;
  }

  if (pumpType === 'step') {
    parts.push({
      kind: 'step',
      y: y + stepH * 0.5,
      h: stepH,
      rTop: r * 1.14,
      rBot: r * 1.02,
    });
    y += stepH;
  }

  parts.push({
    kind: 'housing',
    y: y + housingH * 0.5,
    h: housingH,
    r: r * 0.46,
  });
  y += housingH;

  parts.push({
    kind: 'actuator',
    y: y + actuatorH * 0.5,
    h: actuatorH,
    rTop: r * 0.58,
    rBot: r * 0.48,
  });
  y += actuatorH;

  parts.push({
    kind: 'button',
    y: y + buttonH * 0.5,
    h: buttonH,
    r: r * 0.26,
  });
  y += buttonH;

  return { parts, totalHeight: y };
};

export const getPumpTopHeight = (neckRadius, pumpType = 'collar') =>
  getPumpDimensions(neckRadius, pumpType).totalHeight;

const Pump = ({ position = [0, 0, 0], neckRadius = 0.12 }) => {
  const snap = useSnapshot(state);
  const r = neckRadius;
  const pumpType = snap.pumpType;
  const color = snap.pumpColor;

  const { parts } = useMemo(
    () => getPumpDimensions(r, pumpType),
    [r, pumpType]
  );

  return (
    <group position={position} renderOrder={4}>
      {parts.map((part) => {
        if (part.kind === 'collar' || part.kind === 'step' || part.kind === 'actuator') {
          return (
            <mesh key={part.kind} castShadow position={[0, part.y, 0]}>
              <cylinderGeometry args={[part.rTop ?? part.r, part.rBot ?? part.r, part.h, 24]} />
              <meshPhysicalMaterial {...metalMat(color)} clearcoat={0.5} clearcoatRoughness={0.15} />
            </mesh>
          );
        }

        if (part.kind === 'housing') {
          return (
            <mesh key={part.kind} castShadow position={[0, part.y, 0]}>
              <cylinderGeometry args={[part.r, part.r, part.h, 20]} />
              <meshPhysicalMaterial
                {...metalMat('#9a9a9a', { metalness: 0.75, roughness: 0.28 })}
                clearcoat={0.35}
              />
            </mesh>
          );
        }

        return (
          <mesh key={part.kind} castShadow position={[0, part.y, 0]}>
            <cylinderGeometry args={[part.r, part.r * 0.92, part.h, 20]} />
            <meshPhysicalMaterial {...metalMat(color)} clearcoat={0.6} clearcoatRoughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Pump;
