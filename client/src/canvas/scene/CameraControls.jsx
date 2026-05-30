import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';

import state from '../../store';
import { liquidPhysics } from './liquidPhysics';

const TARGET_SMOOTH = 8;
const VEL_DECAY = 0.84;
const TILT_SCALE = 22;
const MAX_TILT = 0.22;

const smoothFactor = (delta, speed = TARGET_SMOOTH) => 1 - Math.exp(-delta * speed);

const CameraControls = () => {
  const snap = useSnapshot(state);
  const controlsRef = useRef(null);
  const targetRef = useRef(new THREE.Vector3(0, snap.bottleMetrics.centerY || 0.6, 0));
  const prevAzimuth = useRef(0);
  const prevPolar = useRef(Math.PI / 2);
  const velZ = useRef(0);
  const velX = useRef(0);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const centerY = snap.bottleMetrics.centerY || 0.6;
    const height = snap.bottleMetrics.height || 1.2;
    const k = smoothFactor(delta);

    targetRef.current.y = THREE.MathUtils.lerp(targetRef.current.y, centerY, k);
    controlsRef.current.target.lerp(targetRef.current, k);
    controlsRef.current.minDistance = Math.max(1.25, height * 1.2);
    controlsRef.current.maxDistance = Math.max(4, height * 3.8);
    controlsRef.current.update();

    // Track rotation for liquid inertia
    const azimuth = controlsRef.current.getAzimuthalAngle();
    const polar = controlsRef.current.getPolarAngle();

    let dAz = azimuth - prevAzimuth.current;
    // Handle wraparound at ±π
    if (dAz > Math.PI) dAz -= 2 * Math.PI;
    if (dAz < -Math.PI) dAz += 2 * Math.PI;

    const dPolar = polar - prevPolar.current;
    prevAzimuth.current = azimuth;
    prevPolar.current = polar;

    // Smooth velocity with exponential decay
    velZ.current = velZ.current * VEL_DECAY + dAz * (1 - VEL_DECAY);
    velX.current = velX.current * VEL_DECAY + dPolar * (1 - VEL_DECAY);

    liquidPhysics.tiltZ = THREE.MathUtils.clamp(-velZ.current * TILT_SCALE, -MAX_TILT, MAX_TILT);
    liquidPhysics.tiltX = THREE.MathUtils.clamp(velX.current * TILT_SCALE, -MAX_TILT, MAX_TILT);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom
      enableRotate
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
      zoomSpeed={0.95}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI - 0.3}
      autoRotate={snap.autoRotate}
      autoRotateSpeed={0.8}
    />
  );
};

export default CameraControls;
