import { useEffect, useMemo, useRef } from 'react';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';

import state from '../../store';
import GlassMaterial from '../materials/GlassMaterial';
import { bottleProfiles } from './BottleGeometry';
import PerfumeLiquid from '../liquid/PerfumeLiquid';
import Cap from '../caps/Cap';
import Pump, { getPumpTopHeight } from '../caps/Pump';
import BottleLabel from './BottleLabel';
import EngravingMesh from './EngravingMesh';
import FragranceLabelMesh from './FragranceLabelMesh';

const CAP_BASE_R = 0.14;
const LATHE_TYPES = new Set(['elegant', 'slender', 'round', 'vintage']);

const ProceduralBottle = () => {
  const snap = useSnapshot(state);
  const groupRef = useRef();

  const geometry = useMemo(
    () => bottleProfiles[snap.bottleType]?.() || bottleProfiles.elegant(),
    [snap.bottleType]
  );

  const liquidGeometry = useMemo(() => {
    const g = geometry.clone();
    g.computeVertexNormals();
    return g;
  }, [geometry]);

  const bottleBounds = useMemo(() => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return null;
    const topY = box.max.y;
    const bottomY = box.min.y;
    const height = topY - bottomY;
    const outerR = Math.max(box.max.x, box.max.z);
    const neckR = Math.max(0.08, outerR * 0.32);
    return { topY, bottomY, height, neckR, capY: topY + 0.01, outerR };
  }, [geometry]);

  useEffect(() => {
    if (!bottleBounds) return;
    state.bottleMetrics = {
      ...state.bottleMetrics,
      height: bottleBounds.height,
      width: bottleBounds.outerR * 2,
      topY: bottleBounds.topY,
      bottomY: bottleBounds.bottomY,
      centerY: (bottleBounds.topY + bottleBounds.bottomY) / 2,
      liquidRadius: Math.max(0.1, bottleBounds.outerR * 0.28),
      neckR: bottleBounds.neckR,
      capY: bottleBounds.capY,
      liquidTopY: bottleBounds.topY,
      liquidBottomY: bottleBounds.bottomY,
      hasNativeCap: false,
      surfaceRadius: bottleBounds.outerR,
    };
  }, [bottleBounds]);

  const labelProps = useMemo(() => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const outerR = Math.max(box.max.x, box.max.z);
    const height = box.max.y - box.min.y;
    const midY = (box.max.y + box.min.y) / 2 - height * 0.04;
    const logoSize = snap.logoSize ?? 1;
    const fragSize = snap.fragranceLabelSize ?? 1;
    const engrSize = snap.engravingSize ?? 1;

    return {
      curvedRadius: outerR * 0.98,
      curvedLabelY: midY,
      curvedLabelH: height * 0.18 * logoSize,
      curvedArc: Math.PI * 0.44 * logoSize,
      logoWidth: outerR * 0.85,
      logoHeight: height * 0.15,
      engravingY: midY - height * 0.20,
      fragranceY: midY - height * 0.30,
      fragHeight: height * 0.15 * 0.7 * fragSize,
      fragArc: Math.PI * 0.4 * fragSize,
      engrHeight: height * 0.15 * 0.7 * engrSize,
      engrArc: Math.PI * 0.4 * engrSize,
      isLathe: LATHE_TYPES.has(snap.bottleType),
    };
  }, [geometry, snap.logoSize, snap.fragranceLabelSize, snap.engravingSize, snap.bottleType]);

  const showCap = snap.showCap !== false && !snap.showPump;

  const capScale = bottleBounds ? bottleBounds.neckR / CAP_BASE_R : 1;
  const capSeatY = bottleBounds
    ? bottleBounds.topY + (snap.showPump ? getPumpTopHeight(bottleBounds.neckR, snap.pumpType) : 0)
    : 0;

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow geometry={geometry} renderOrder={1}>
        <GlassMaterial />
      </mesh>

      <BottleLabel
        bottleGeometry={labelProps.isLathe ? geometry : null}
        useCurvedLogo
        curvedRadius={labelProps.curvedRadius}
        curvedLabelY={labelProps.curvedLabelY}
        curvedLabelH={labelProps.curvedLabelH}
        curvedArc={labelProps.curvedArc}
        wrapScale={1.016}
      />

      <FragranceLabelMesh
        position={[0, labelProps.fragranceY, 0]}
        width={labelProps.logoWidth * 0.9}
        height={labelProps.fragHeight}
        curvedRadius={labelProps.isLathe ? labelProps.curvedRadius : null}
        curvedArc={labelProps.fragArc}
      />

      <EngravingMesh
        position={[0, labelProps.engravingY, 0]}
        width={labelProps.logoWidth}
        height={labelProps.engrHeight}
        curvedRadius={labelProps.isLathe ? labelProps.curvedRadius : null}
        curvedArc={labelProps.engrArc}
      />

      <PerfumeLiquid
        geometry={liquidGeometry}
        bottleType={snap.bottleType}
        isLathe={labelProps.isLathe}
        basePosition={[0, 0, 0]}
        innerScale={0.84}
      />

      {snap.showPump && bottleBounds && (
        <Pump
          position={[0, bottleBounds.topY, 0]}
          neckRadius={bottleBounds.neckR}
        />
      )}

      {showCap && bottleBounds && (
        <Cap
          key={snap.capCatalogId}
          seatY={capSeatY}
          scale={capScale}
        />
      )}
    </group>
  );
};

export default ProceduralBottle;
