import { forwardRef, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import * as THREE from 'three';

import state from '../../store';

const glassTintFromHex = (hex) => {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  const sat = hsl.s ?? 0;
  return {
    attenuationDistance: Math.max(0.18, 0.55 - sat * 0.38),
    transmission: Math.max(0.86, 0.84 + (1 - sat) * 0.08),
  };
};

/**
 * Premium glass material with:
 * - Physical transmission (refractive glass)
 * - Thin-film iridescence (rainbow shimmer on glass surface)
 * - Real-time color animation via easing
 */
const GlassMaterial = forwardRef(({ color: colorProp, ...props }, ref) => {
  const snap = useSnapshot(state);
  const internalRef = useRef();
  const matRef = ref || internalRef;
  const colorRef = useRef(new THREE.Color(colorProp || snap.color));

  useFrame((_, delta) => {
    const target = colorProp || snap.color;
    easing.dampC(colorRef.current, target, 0.25, delta);
    if (matRef.current) {
      const tint = glassTintFromHex(target);
      matRef.current.color.copy(colorRef.current);
      matRef.current.attenuationColor.copy(colorRef.current);
      matRef.current.transmission = tint.transmission;
      matRef.current.attenuationDistance = tint.attenuationDistance;
      matRef.current.iridescence = snap.bottleShine;
      matRef.current.roughness = snap.glassRoughness ?? 0.018;
      matRef.current.clearcoatRoughness = Math.max(0.01, (snap.glassRoughness ?? 0.018) * 0.5);
    }
  });

  return (
    <meshPhysicalMaterial
      ref={matRef}
      color={colorProp || snap.color}
      roughness={snap.glassRoughness ?? 0.018}
      metalness={0}
      transmission={0.92}
      thickness={1}
      ior={1.55}
      transparent
      clearcoat={1}
      clearcoatRoughness={0.01}
      attenuationColor={colorProp || snap.color}
      attenuationDistance={0.35}
      envMapIntensity={2}
      reflectivity={1}
      specularIntensity={1}
      specularColor="#ffffff"
      /* Thin-film iridescence — gives the characteristic rainbow shimmer of luxury glass */
      iridescence={snap.bottleShine}
      iridescenceIOR={1.32}
      iridescenceThicknessRange={[80, 380]}
      depthWrite={false}
      {...props}
    />
  );
});

GlassMaterial.displayName = 'GlassMaterial';

export default GlassMaterial;
