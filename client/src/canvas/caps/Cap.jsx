import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import * as THREE from 'three';

import state from '../../store';

const FINISH = {
  gold:   { metalness: 1,    roughness: 0.12, clearcoat: 0.85, clearcoatRoughness: 0.08 },
  silver: { metalness: 1,    roughness: 0.1,  clearcoat: 0.9,  clearcoatRoughness: 0.06 },
  matte:  { metalness: 0.05, roughness: 0.92, clearcoat: 0.1,  clearcoatRoughness: 0.9  },
  custom: { metalness: 0.85, roughness: 0.2,  clearcoat: 0.55, clearcoatRoughness: 0.18 },
};

const ClassicCap = ({ materialRef, accentTopRef, accentRingRef, finish }) => (
  <group>
    <mesh castShadow>
      <cylinderGeometry args={[0.14, 0.14, 0.22, 32]} />
      <meshPhysicalMaterial ref={materialRef} {...finish} />
    </mesh>
    <mesh castShadow position={[0, 0.14, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.06, 32]} />
      <meshPhysicalMaterial ref={accentTopRef} metalness={0.95} roughness={0.08} clearcoat={0.8} />
    </mesh>
    <mesh position={[0, -0.08, 0]}>
      <torusGeometry args={[0.145, 0.012, 8, 32]} />
      <meshPhysicalMaterial ref={accentRingRef} metalness={1} roughness={0.06} clearcoat={1} />
    </mesh>
  </group>
);

const DomeCap = ({ materialRef, accentRef, finish }) => (
  <group>
    <mesh castShadow>
      <cylinderGeometry args={[0.15, 0.16, 0.12, 32]} />
      <meshPhysicalMaterial ref={materialRef} {...finish} />
    </mesh>
    <mesh castShadow position={[0, 0.14, 0]}>
      <sphereGeometry args={[0.14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial ref={accentRef} metalness={0.92} roughness={0.1} clearcoat={0.7} />
    </mesh>
  </group>
);

const ModernCap = ({ materialRef, accentRef, finish }) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[0.26, 0.2, 0.26]} />
      <meshPhysicalMaterial ref={materialRef} {...finish} />
    </mesh>
    <mesh castShadow position={[0, 0.14, 0]}>
      <boxGeometry args={[0.18, 0.08, 0.18]} />
      <meshPhysicalMaterial ref={accentRef} metalness={0.85} roughness={0.12} clearcoat={0.6} />
    </mesh>
  </group>
);

const capComponents = {
  classic: { Component: ClassicCap, position: [0, 0.72, 0], dualAccent: true },
  dome:    { Component: DomeCap,    position: [0, 0.7,  0], dualAccent: false },
  modern:  { Component: ModernCap,  position: [0, 0.72, 0], dualAccent: false },
};

const Cap = ({ position: posOverride, scale = 1 }) => {
  const snap = useSnapshot(state);
  const materialRef = useRef();
  const accentRef = useRef();
  const accentTopRef = useRef();
  const accentRingRef = useRef();
  const groupRef = useRef();
  const colorRef = useRef(new THREE.Color(snap.capColor));
  const liftRef = useRef(0);

  const { Component, position, dualAccent } = capComponents[snap.capType] || capComponents.classic;
  const finish = FINISH[snap.capFinish] || FINISH.custom;
  const basePos = posOverride || position;
  const bottleH = snap.bottleMetrics?.height ?? 1.2;

  useFrame((_, delta) => {
    easing.dampC(colorRef.current, snap.capColor, 0.25, delta);
    if (materialRef.current) materialRef.current.color.copy(colorRef.current);
    if (accentRef.current) accentRef.current.color.copy(colorRef.current);
    if (accentTopRef.current) accentTopRef.current.color.copy(colorRef.current);
    if (accentRingRef.current) accentRingRef.current.color.copy(colorRef.current);

    const targetLift = state.capOpen ? bottleH * 0.14 : 0;
    liftRef.current = THREE.MathUtils.lerp(liftRef.current, targetLift, 1 - Math.exp(-delta * 6));

    if (groupRef.current) {
      groupRef.current.position.set(0, liftRef.current, 0);
      groupRef.current.rotation.x = -liftRef.current * 0.22;
    }
  });

  const capProps = dualAccent
    ? { materialRef, accentTopRef, accentRingRef, finish }
    : { materialRef, accentRef, finish };

  return (
    <group position={basePos}>
      <group ref={groupRef} scale={[scale, scale, scale]}>
        <Component {...capProps} />
      </group>
    </group>
  );
};

export default Cap;
