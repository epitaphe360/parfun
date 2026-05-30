import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';

import state from '../../store';

const N = 90; // particle count

/**
 * Spray particle system.
 * Triggers when `state.sprayActive` flips to true.
 * Particles burst upward from the bottle nozzle with slight spread,
 * then fall under simulated gravity and fade out.
 */
const SprayParticles = ({ origin = [0, 1.1, 0] }) => {
  const snap = useSnapshot(state);
  const pointsRef = useRef();

  const prevActive = useRef(false);
  const alive = useRef(false);

  // Particle data — stored in flat Float32Arrays for performance
  const positions = useMemo(() => new Float32Array(N * 3), []);
  const velocities = useMemo(() => new Float32Array(N * 3), []);
  const lifetimes = useMemo(() => new Float32Array(N).fill(-1), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  // Dispose GPU buffers when the component unmounts
  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  const initParticle = (i) => {
    const spread = 0.07;
    positions[i * 3]     = origin[0] + (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = origin[1];
    positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * spread;

    velocities[i * 3]     = (Math.random() - 0.5) * 0.35;
    velocities[i * 3 + 1] = Math.random() * 0.9 + 0.25;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.35;

    lifetimes[i] = Math.random() * 0.9 + 0.4;
  };

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    // Rising edge: trigger burst
    if (snap.sprayActive && !prevActive.current) {
      for (let i = 0; i < N; i++) initParticle(i);
      alive.current = true;
    }
    prevActive.current = snap.sprayActive;

    if (!alive.current) {
      pointsRef.current.visible = false;
      return;
    }

    pointsRef.current.visible = true;
    let anyAlive = false;

    for (let i = 0; i < N; i++) {
      if (lifetimes[i] <= 0) continue;
      anyAlive = true;
      lifetimes[i] -= delta;

      positions[i * 3]     += velocities[i * 3]     * delta;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Simulated gravity
      velocities[i * 3 + 1] -= 0.6 * delta;
    }

    geometry.attributes.position.needsUpdate = true;

    if (!anyAlive) {
      alive.current = false;
      // Defer state mutation off the render loop to keep Valtio subscriptions clean
      queueMicrotask(() => { state.sprayActive = false; });
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} visible={false}>
      <pointsMaterial
        color={snap.liquidColor}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
      />
    </points>
  );
};

export default SprayParticles;
