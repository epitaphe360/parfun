import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import state from '../../store';
import { buildSurfaceLabel } from './buildSurfaceLabel';

const W = 512;
const H = 80;

const buildLabelTexture = (name, volumeMl) => {
  const safeName = String(name ?? 'MON PARFUM').trim() || 'MON PARFUM';
  const vol = Number(volumeMl) || 50;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = '#1A1A1A';
  ctx.fillText(safeName.toUpperCase(), W / 2, H * 0.38);

  ctx.font = '500 15px "DM Sans", Helvetica, sans-serif';
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#1A1A1A';
  ctx.fillText(`${vol} ml`, W / 2, H * 0.72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Fragrance name + volume label — curved or flat depending on curvedRadius.
 */
const FragranceLabelMesh = ({
  position = [0, -0.28, 0.44],
  width = 0.30,
  height = 0.055,
  curvedRadius = null,
  curvedArc = Math.PI * 0.48,
  bottleRoot = null,
}) => {
  const snap = useSnapshot(state);

  const texture = useMemo(
    () => buildLabelTexture(snap.fragranceName || 'MON PARFUM', snap.volumeMl ?? 50),
    [snap.fragranceName, snap.volumeMl]
  );

  useEffect(() => () => { texture?.dispose(); }, [texture]);

  const arcGeometry = useMemo(() => {
    if (bottleRoot) {
      return buildSurfaceLabel(bottleRoot, position[1], height, curvedArc);
    }
    if (curvedRadius === null) return null;
    return new THREE.CylinderGeometry(
      curvedRadius * 1.012,
      curvedRadius * 1.012,
      height,
      32, 1, true,
      -curvedArc / 2,
      curvedArc,
    );
  }, [bottleRoot, position[1], curvedRadius, height, curvedArc]);

  if (!snap.showFragranceLabel) return null;

  const mat = (
    <meshBasicMaterial
      map={texture}
      transparent
      alphaTest={0.01}
      depthWrite={false}
      depthTest
      side={THREE.DoubleSide}
    />
  );

  if (arcGeometry) {
    const pos = bottleRoot ? [0, 0, 0] : [0, position[1], 0];
    return (
      <mesh geometry={arcGeometry} position={pos} renderOrder={6}>
        {mat}
      </mesh>
    );
  }

  return (
    <mesh position={position} renderOrder={6}>
      <planeGeometry args={[width, height]} />
      {mat}
    </mesh>
  );
};

export default FragranceLabelMesh;
