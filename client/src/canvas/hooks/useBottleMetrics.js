import { useEffect } from 'react';
import * as THREE from 'three';

import state from '../../store';

/**
 * Compute and publish bottle metrics from a 3D object (procedural or GLB).
 */
const useBottleMetrics = (object3d, opts = {}) => {
  const {
    bodyRatio = 0.72,
    hasNativeCap = false,
    capOffset = 0.04,
    bodyTopY: bodyTopYOverride = null,
  } = opts;

  useEffect(() => {
    if (!object3d) return;
    object3d.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object3d);
    if (!isFinite(box.min.y)) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const bottomY = center.y - size.y / 2;
    const topY = center.y + size.y / 2;
    const liquidBottomY = bottomY;
    const liquidTopY = bodyTopYOverride ?? (hasNativeCap
      ? bottomY + size.y * bodyRatio
      : topY);

    state.bottleMetrics = {
      height: size.y,
      width: Math.max(size.x, size.z),
      topY,
      bottomY,
      centerY: center.y,
      liquidRadius: Math.max(0.12, Math.min(0.28, Math.max(size.x, size.z) * 0.32)),
      capY: topY + capOffset,
      liquidTopY,
      liquidBottomY,
      hasNativeCap,
      surfaceRadius: Math.max(size.x, size.z) * 0.5,
    };
  }, [object3d, bodyRatio, hasNativeCap, capOffset, bodyTopYOverride]);
};

export default useBottleMetrics;
