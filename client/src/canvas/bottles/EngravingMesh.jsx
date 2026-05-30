import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';

import state from '../../store';
import { buildSurfaceLabel } from './buildSurfaceLabel';

const W = 512;
const H = 128;

const buildEngravingTexture = (text, font, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const fontFamily =
    font === 'serif'
      ? '"Playfair Display", Georgia, "Times New Roman", serif'
      : '"DM Sans", "Helvetica Neue", Arial, sans-serif';

  ctx.font = `bold 46px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = color;
  ctx.fillText(text, W / 2, H / 2);

  ctx.shadowColor = 'transparent';
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.strokeText(text, W / 2 - 0.5, H / 2 - 0.5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Engraving mesh — two modes:
 *   curved (curvedRadius set) : CylinderGeometry arc that hugs the bottle surface
 *   flat   (default)          : PlaneGeometry facing +Z
 */
const EngravingMesh = ({
  position = [0, -0.1, 0.44],
  width = 0.32,
  height = 0.07,
  curvedRadius = null,
  curvedArc = Math.PI * 0.48,
  bottleRoot = null,     // GLB root → label follows the actual surface profile
}) => {
  const snap = useSnapshot(state);

  const texture = useMemo(() => {
    if (!snap.showEngraving || !snap.engravingText?.trim()) return null;
    return buildEngravingTexture(snap.engravingText, snap.engravingFont, snap.engravingColor);
  }, [snap.showEngraving, snap.engravingText, snap.engravingFont, snap.engravingColor]);

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

  if (!snap.showEngraving || !snap.engravingText?.trim() || !texture) return null;

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
    // When bottleRoot is provided, geometry already lives at world Y → use origin
    const pos = bottleRoot ? [0, 0, 0] : [0, position[1], 0];
    return (
      <mesh geometry={arcGeometry} position={pos} renderOrder={7}>
        {mat}
      </mesh>
    );
  }

  return (
    <mesh position={position} renderOrder={7}>
      <planeGeometry args={[width, height]} />
      {mat}
    </mesh>
  );
};

export default EngravingMesh;
