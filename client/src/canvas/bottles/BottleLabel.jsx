import { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../../store';
import { buildSurfaceLabel } from './buildSurfaceLabel';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const TRANSPARENT_PIXELS = new Set([
  'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
  TRANSPARENT_PIXEL,
]);

export const isRealImage = (src) =>
  !!src
  && !TRANSPARENT_PIXELS.has(src)
  && (src.startsWith('data:image/') || src.startsWith('blob:'));

/**
 * Renders label / logo overlays.
 *
 * Two modes for the logo:
 *   - Curved  (useCurvedLogo=true)  : CylinderGeometry arc that hugs the bottle surface
 *   - Flat    (useCurvedLogo=false) : simple PlaneGeometry in front of the bottle
 *
 * The full-wrap label uses a slightly enlarged clone of the bottle geometry.
 * For GLB bottles, pass bottleGeometry=null; the parent handles full-wrap via material.map.
 */
const BottleLabel = ({
  bottleGeometry = null,
  bottleRoot = null,     // Pass GLB root → label follows actual surface
  wrapScale = 1.016,
  wrapOffsetY = 0,
  useCurvedLogo = false,
  curvedRadius = 0.43,
  curvedLabelY = 0,
  curvedLabelH = 0.18,
  curvedArc = Math.PI * 0.46,
  logoPosition = [0, 0, 0.44],
  logoWidth = 0.22,
  logoHeight = 0.15,
}) => {
  const snap = useSnapshot(state);

  const showLogo = snap.isLogoTexture && isRealImage(snap.logoDecal);
  const showFull = snap.isFullTexture && isRealImage(snap.fullDecal);

  const logoTex = useTexture(isRealImage(snap.logoDecal) ? snap.logoDecal : TRANSPARENT_PIXEL);
  const fullTex = useTexture(isRealImage(snap.fullDecal) ? snap.fullDecal : TRANSPARENT_PIXEL);

  // Full-wrap overlay — slightly scaled bottle geometry
  const wrapGeometry = useMemo(() => {
    if (!bottleGeometry || !showFull) return null;
    const g = bottleGeometry.clone();
    g.applyMatrix4(new THREE.Matrix4().makeScale(wrapScale, 1, wrapScale));
    g.computeVertexNormals();
    return g;
  }, [bottleGeometry, wrapScale, showFull]);

  // Curved logo geometry — follows the EXACT bottle surface when bottleRoot is provided.
  // Falls back to a fixed-radius arc cylinder otherwise (procedural mode).
  const curvedLogoGeometry = useMemo(() => {
    if (!useCurvedLogo) return null;
    if (bottleRoot) {
      return buildSurfaceLabel(bottleRoot, curvedLabelY, curvedLabelH, curvedArc);
    }
    return new THREE.CylinderGeometry(
      curvedRadius * 1.012,
      curvedRadius * 1.012,
      curvedLabelH,
      32, 1, true,
      -curvedArc / 2,
      curvedArc,
    );
  }, [useCurvedLogo, bottleRoot, curvedLabelY, curvedRadius, curvedLabelH, curvedArc]);

  const labelMat = { transparent: true, alphaTest: 0.01, depthWrite: false, depthTest: true };

  return (
    <>
      {/* Full-wrap texture on procedural geometry */}
      {showFull && wrapGeometry && (
        <mesh geometry={wrapGeometry} position={[0, wrapOffsetY, 0]} renderOrder={5}>
          <meshBasicMaterial
            map={fullTex}
            side={THREE.FrontSide}
            {...labelMat}
          />
        </mesh>
      )}

      {/* Logo — curved (surface-fitted or cylindrical arc) */}
      {showLogo && useCurvedLogo && curvedLogoGeometry && (
        <mesh
          geometry={curvedLogoGeometry}
          position={bottleRoot ? [0, 0, 0] : [0, curvedLabelY, 0]}
          renderOrder={6}
        >
          <meshBasicMaterial map={logoTex} side={THREE.DoubleSide} {...labelMat} />
        </mesh>
      )}

      {showLogo && !useCurvedLogo && (
        <mesh position={logoPosition} renderOrder={6}>
          <planeGeometry args={[logoWidth, logoHeight]} />
          <meshBasicMaterial map={logoTex} {...labelMat} />
        </mesh>
      )}
    </>
  );
};

export default BottleLabel;
