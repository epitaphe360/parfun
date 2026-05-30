import { useMemo } from 'react';
import {
  EffectComposer, Bloom, Vignette,
  ChromaticAberration, ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import state from '../../store';

const BLOOM_BY_ENV = {
  studio:    0.32,
  sunset:    0.50,
  city:      0.58,
  forest:    0.22,
  dawn:      0.38,
  lobby:     0.30,
  apartment: 0.18,
  warehouse: 0.44,
  night:     0.70,
  park:      0.24,
};

// Chromatic aberration offset — subtle on light backgrounds, stronger in dark mode
const CA_LIGHT = new THREE.Vector2(0.0003, 0.0003);
const CA_DARK  = new THREE.Vector2(0.0006, 0.0006);

const PostProcessing = () => {
  const snap = useSnapshot(state);
  const bloomIntensity = BLOOM_BY_ENV[snap.environment] ?? 0.32;
  const isDark = snap.bgMode === 'dark' || snap.bgMode === 'midnight' || snap.environment === 'night';
  const caOffset = useMemo(() => isDark ? CA_DARK : CA_LIGHT, [isDark]);

  return (
    <EffectComposer multisampling={4}>
      {/* ACES filmic tone-mapping — gives cinematic warmth and contrast */}
      <ToneMapping
        blendFunction={BlendFunction.NORMAL}
        adaptive={false}
        mode={ToneMappingMode.ACES_FILMIC}
        resolution={256}
        middleGrey={0.6}
        maxLuminance={16}
        averageLuminance={1}
        adaptationRate={1}
      />

      <Bloom
        luminanceThreshold={isDark ? 0.55 : 0.78}
        luminanceSmoothing={0.65}
        intensity={bloomIntensity}
        mipmapBlur
      />

      {/* Chromatic aberration — simulates dispersion through premium glass */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset}
        radialModulation
        modulationOffset={0.25}
      />

      <Vignette eskil={false} offset={isDark ? 0.1 : 0.18} darkness={isDark ? 0.32 : 0.20} />
    </EffectComposer>
  );
};

export default PostProcessing;
