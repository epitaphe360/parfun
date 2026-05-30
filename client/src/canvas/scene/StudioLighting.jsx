import { useEffect } from 'react';
import { ContactShadows, Environment } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import state from '../../store';

// Valid drei Environment preset names
const VALID_PRESETS = new Set([
  'studio', 'sunset', 'city', 'forest', 'dawn',
  'lobby', 'apartment', 'warehouse', 'night', 'park',
]);

const BG_STYLES = {
  warm:     'linear-gradient(135deg, #F5F0EB 0%, #EDE4D8 50%, #E8DDD0 100%)',
  white:    '#FAFAFA',
  dark:     '#111111',
  midnight: 'linear-gradient(160deg, #0A0A1A 0%, #141428 60%, #0F0F1F 100%)',
};

// Ambient / directional intensities tuned per environment
const LIGHT_PROFILES = {
  studio:    { ambient: 0.22, main: 1.7,  fill: 0.65, rim: 0.85 },
  sunset:    { ambient: 0.18, main: 1.4,  fill: 0.8,  rim: 0.6  },
  city:      { ambient: 0.12, main: 1.2,  fill: 0.45, rim: 0.9  },
  forest:    { ambient: 0.28, main: 1.2,  fill: 0.55, rim: 0.5  },
  dawn:      { ambient: 0.2,  main: 1.5,  fill: 0.7,  rim: 0.7  },
  lobby:     { ambient: 0.2,  main: 1.6,  fill: 0.6,  rim: 0.75 },
  apartment: { ambient: 0.25, main: 1.1,  fill: 0.5,  rim: 0.65 },
  warehouse: { ambient: 0.15, main: 1.8,  fill: 0.3,  rim: 1.0  },
  night:     { ambient: 0.08, main: 0.8,  fill: 0.35, rim: 1.1  },
  park:      { ambient: 0.3,  main: 1.25, fill: 0.6,  rim: 0.55 },
};

const StudioLighting = () => {
  const snap = useSnapshot(state);
  const preset = VALID_PRESETS.has(snap.environment) ? snap.environment : 'studio';
  const lights = LIGHT_PROFILES[preset] || LIGHT_PROFILES.studio;

  // Update page background when bgMode changes
  useEffect(() => {
    document.documentElement.style.background = BG_STYLES[snap.bgMode] || BG_STYLES.warm;
  }, [snap.bgMode]);

  return (
    <>
      <ambientLight intensity={lights.ambient} />
      <directionalLight
        position={[3.6, 6.2, 5.5]}
        intensity={lights.main}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-4.2, 3.2, -2.4]} intensity={lights.fill} color="#FFE9C8" />
      <pointLight position={[0.8, 2.8, 2.8]} intensity={lights.rim} color="#FFF5E6" />
      <pointLight position={[-1.5, 1.5, -2.2]} intensity={0.35} color="#FFD69B" />

      <Environment preset={preset} />

      <ContactShadows
        position={[0, snap.bottleMetrics.bottomY - 0.005, 0]}
        opacity={0.32}
        scale={Math.max(2.5, (snap.bottleMetrics.width || 1) * 5)}
        blur={1.9}
        far={2.6}
      />
    </>
  );
};

export default StudioLighting;
