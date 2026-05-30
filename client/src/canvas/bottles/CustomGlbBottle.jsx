import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import { useGLTF, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

import state from '../../store';
import BottleLabel, { isRealImage } from './BottleLabel';
import EngravingMesh from './EngravingMesh';
import FragranceLabelMesh from './FragranceLabelMesh';
import { normalizeObject } from '../../utils/exportGlb';
import useBottleMetrics from '../hooks/useBottleMetrics';
import GlbInteriorLiquid from '../liquid/GlbInteriorLiquid';
import { detectBodyTopY, sampleBottleRadius } from '../hooks/sampleBottleRadius';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const CAP_FINISH = {
  gold:   { metalness: 1,    roughness: 0.12, clearcoat: 0.85, clearcoatRoughness: 0.08 },
  silver: { metalness: 1,    roughness: 0.1,  clearcoat: 0.9,  clearcoatRoughness: 0.06 },
  matte:  { metalness: 0.05, roughness: 0.92, clearcoat: 0.1,  clearcoatRoughness: 0.9  },
  custom: { metalness: 0.85, roughness: 0.2,  clearcoat: 0.55, clearcoatRoughness: 0.18 },
};

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

const makeGlassMaterial = (color, clippingPlanes = []) => {
  const tint = glassTintFromHex(color);
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.018,
    metalness: 0,
    transmission: tint.transmission,
    thickness: 1,
    ior: 1.55,
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: tint.attenuationDistance,
    envMapIntensity: 2,
    iridescence: state.bottleShine,
    iridescenceIOR: 1.32,
    iridescenceThicknessRange: [80, 380],
    depthWrite: false,
    clippingPlanes,
    clipShadows: true,
  });
};

const makeMetalCapMaterial = (color, finishKey, clippingPlanes = []) => {
  const f = CAP_FINISH[finishKey] || CAP_FINISH.custom;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    ...f,
    transmission: 0,
    ior: 2.4,
    envMapIntensity: 1.6,
    clippingPlanes,
    clipShadows: true,
  });
};

const prepareScene = (scene) => {
  const root = scene.clone(true);
  normalizeObject(root, 1.2);
  root.position.y = 0.6;
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const bottomY = center.y - size.y / 2;
  const topY = center.y + size.y / 2;
  const bodyTopY = detectBodyTopY(root, bottomY, topY);

  return {
    root, size, center, bottomY, topY,
    bodyTopY,
    liquidBottomY: bottomY,
    liquidTopY: bodyTopY,
    bodyRatio: (bodyTopY - bottomY) / size.y,
  };
};

const BottleShell = ({ source, bodyTopY, bottleHeight }) => {
  const snap = useSnapshot(state);
  const { gl } = useThree();
  const capGroupRef = useRef();
  const capLiftRef = useRef(0);

  const bodyPlane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), bodyTopY));
  const capPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -bodyTopY));

  useEffect(() => { gl.localClippingEnabled = true; }, [gl]);

  const { bodyObj, capObj, bodyMats, capMats } = useMemo(() => {
    const bodyClone = source.clone(true);
    const capClone = source.clone(true);
    const bMats = [];
    const cMats = [];

    bodyClone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.renderOrder = 2;
      const mat = makeGlassMaterial(snap.color, [bodyPlane.current]);
      child.material = mat;
      bMats.push(mat);
    });

    capClone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.renderOrder = 3;
      const mat = makeMetalCapMaterial(snap.capColor, snap.capFinish, [capPlane.current]);
      child.material = mat;
      cMats.push(mat);
    });

    return { bodyObj: bodyClone, capObj: capClone, bodyMats: bMats, capMats: cMats };
  }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bodyPlane.current.constant = bodyTopY;
    capPlane.current.constant = -bodyTopY;
  }, [bodyTopY]);

  useFrame((_, delta) => {
    const tint = glassTintFromHex(snap.color);
    bodyMats.forEach((mat) => {
      easing.dampC(mat.color, snap.color, 0.25, delta);
      easing.dampC(mat.attenuationColor, snap.color, 0.25, delta);
      mat.transmission = tint.transmission;
      mat.attenuationDistance = tint.attenuationDistance;
      mat.iridescence = snap.bottleShine;
    });

    const finish = CAP_FINISH[snap.capFinish] || CAP_FINISH.custom;
    capMats.forEach((mat) => {
      easing.dampC(mat.color, snap.capColor, 0.25, delta);
      mat.metalness = finish.metalness;
      mat.roughness = finish.roughness;
      mat.clearcoat = finish.clearcoat;
      mat.clearcoatRoughness = finish.clearcoatRoughness;
    });

    const liftMax = (bottleHeight ?? 1.2) * 0.14;
    const target = state.capOpen ? liftMax : 0;
    capLiftRef.current = THREE.MathUtils.lerp(
      capLiftRef.current, target, 1 - Math.exp(-delta * 6)
    );

    bodyPlane.current.constant = bodyTopY;

    if (capGroupRef.current) {
      const lift = capLiftRef.current;
      capGroupRef.current.position.set(0, lift, 0);
      capGroupRef.current.rotation.x = -lift * 0.22;
    }
  });

  return (
    <group>
      <primitive object={bodyObj} />
      <group position={[0, bodyTopY, 0]}>
        <group ref={capGroupRef}>
          <group position={[0, -bodyTopY, 0]}>
            <primitive object={capObj} />
          </group>
        </group>
      </group>
    </group>
  );
};

const buildWrapSleeve = (bottleRoot, bottomY, topY, fallbackR) => {
  const STEPS_V = 24;
  const STEPS_U = 64;
  const offset = 1.006;
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let j = 0; j <= STEPS_V; j++) {
    const v = j / STEPS_V;
    const y = THREE.MathUtils.lerp(bottomY, topY, v);
    const r = sampleBottleRadius(bottleRoot, y, fallbackR) * offset;

    for (let i = 0; i <= STEPS_U; i++) {
      const u = i / STEPS_U;
      const theta = u * Math.PI * 2 - Math.PI;
      vertices.push(r * Math.sin(theta), y, r * Math.cos(theta));
      uvs.push(u, v);
    }
  }

  for (let j = 0; j < STEPS_V; j++) {
    for (let i = 0; i < STEPS_U; i++) {
      const a = j * (STEPS_U + 1) + i;
      const b = a + 1;
      const c = a + (STEPS_U + 1);
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
};

const GlbWrapOverlay = ({ bottleRoot, bottomY, bodyTopY, fallbackR, fullTexture }) => {
  const snap = useSnapshot(state);
  const show = snap.isFullTexture && isRealImage(snap.fullDecal) && fullTexture;

  const geometry = useMemo(
    () => (bottleRoot ? buildWrapSleeve(bottleRoot, bottomY, bodyTopY, fallbackR) : null),
    [bottleRoot, bottomY, bodyTopY, fallbackR]
  );

  if (!show || !geometry) return null;

  return (
    <mesh geometry={geometry} renderOrder={5}>
      <meshBasicMaterial
        map={fullTexture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        depthTest
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

const CustomGlbBottle = ({ url = '/perfume_bottle.glb' }) => {
  const snap = useSnapshot(state);
  const { scene } = useGLTF(url);

  const fullTexSrc = isRealImage(snap.fullDecal) ? snap.fullDecal : TRANSPARENT_PIXEL;
  const fullTexture = useTexture(fullTexSrc);

  const pack = useMemo(() => prepareScene(scene), [scene]);

  useBottleMetrics(pack.root, {
    bodyRatio: pack.bodyRatio,
    hasNativeCap: true,
    bodyTopY: pack.bodyTopY,
  });

  useEffect(() => {
    if (state.importStatus === 'loading' && pack?.root) {
      state.importStatus = 'done';
      state.importError = '';
    }
  }, [pack, url]);

  useEffect(() => {
    if (state.importStatus !== 'loading') return undefined;
    const timer = setTimeout(() => {
      if (state.importStatus === 'loading') {
        state.importStatus = 'error';
        state.importError = 'Chargement GLB trop long ou fichier invalide.';
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [url]);

  const labels = useMemo(() => {
    if (!pack?.size || !pack?.root) return null;

    const bodySpan = pack.bodyTopY - pack.bottomY;
    const midBodyY = pack.bottomY + bodySpan * 0.5;
    const bboxR = Math.max(pack.size.x, pack.size.z) * 0.5;
    const rayR = sampleBottleRadius(pack.root, midBodyY, bboxR);
    const outerR = Math.max(rayR, bboxR * 0.85);

    return {
      curvedLabelY: midBodyY + bodySpan * 0.05,
      curvedLabelH: bodySpan * 0.18,
      fragrancePos: [0, midBodyY - bodySpan * 0.12, outerR],
      engravingPos: [0, midBodyY - bodySpan * 0.24, outerR],
      width: bboxR * 0.9,
    };
  }, [pack]);

  if (!labels) return null;

  return (
    <group>
      <BottleShell
        source={pack.root}
        bodyTopY={pack.bodyTopY}
        bottleHeight={pack.size.y}
      />

      <GlbInteriorLiquid
        bottleRoot={pack.root}
        bodyTopY={pack.bodyTopY}
        liquidBottomY={pack.liquidBottomY}
      />

      <BottleLabel
        useCurvedLogo
        bottleRoot={pack.root}
        curvedLabelY={labels.curvedLabelY}
        curvedLabelH={labels.curvedLabelH * (snap.logoSize ?? 1)}
        curvedArc={Math.PI * 0.4 * (snap.logoSize ?? 1)}
      />

      <GlbWrapOverlay
        bottleRoot={pack.root}
        bottomY={pack.bottomY}
        bodyTopY={pack.bodyTopY}
        fallbackR={Math.max(pack.size.x, pack.size.z) * 0.5}
        fullTexture={fullTexture}
      />

      <FragranceLabelMesh
        position={labels.fragrancePos}
        height={labels.width * 0.1 * (snap.fragranceLabelSize ?? 1)}
        curvedArc={Math.PI * 0.4 * (snap.fragranceLabelSize ?? 1)}
        bottleRoot={pack.root}
      />

      <EngravingMesh
        position={labels.engravingPos}
        height={labels.width * 0.12 * (snap.engravingSize ?? 1)}
        curvedArc={Math.PI * 0.4 * (snap.engravingSize ?? 1)}
        bottleRoot={pack.root}
      />
    </group>
  );
};

useGLTF.preload('/perfume_bottle.glb');

export default CustomGlbBottle;
