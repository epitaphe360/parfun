import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((_, delta) => {
    const rotX = snap.intro ? -0.02 : 0;
    const rotY = snap.intro ? 0.08 : 0;
    easing.dampE(
      group.current.rotation,
      [rotX, rotY, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
