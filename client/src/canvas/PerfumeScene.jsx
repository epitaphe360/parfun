import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSnapshot } from 'valtio';

import state from '../store';
import { bottleGroupRef, sceneRef } from '../utils/sceneRef';
import CustomGlbBottle from './bottles/CustomGlbBottle';
import ProceduralBottle from './bottles/ProceduralBottle';
import SprayParticles from './effects/SprayParticles';
import { getPumpTopHeight } from './caps/Pump';

const PerfumeScene = () => {
  const snap = useSnapshot(state);
  const { scene } = useThree();
  const groupRef = useRef();

  useEffect(() => {
    sceneRef.current = scene;
    return () => { sceneRef.current = null; };
  }, [scene]);

  useEffect(() => {
    bottleGroupRef.current = groupRef.current;
    return () => { bottleGroupRef.current = null; };
  });

  const renderBottle = () => {
    if (snap.useCustomGlb && snap.customGlbUrl) {
      return <CustomGlbBottle url={snap.customGlbUrl} />;
    }
    if (snap.bottleSource === 'glb') {
      return <CustomGlbBottle url="/perfume_bottle.glb" />;
    }
    return <ProceduralBottle />;
  };

  const capLift = state.capOpen ? (snap.bottleMetrics?.height ?? 1.2) * 0.14 : 0;
  const neckR = snap.bottleMetrics?.neckR ?? snap.bottleMetrics?.liquidRadius ?? 0.12;
  const pumpExtra = snap.showPump ? getPumpTopHeight(neckR, snap.pumpType) : 0;
  const nozzleY = (snap.bottleMetrics?.topY ?? 1.2) + pumpExtra + capLift + 0.03;

  return (
    <group ref={groupRef}>
      {renderBottle()}
      <SprayParticles origin={[0, nozzleY, 0]} />
    </group>
  );
};

export default PerfumeScene;
