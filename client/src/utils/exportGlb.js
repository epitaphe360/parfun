import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

export const exportSceneToGlb = (object3d) =>
  new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object3d,
      (result) => {
        const blob = new Blob([result], { type: 'application/octet-stream' });
        resolve(URL.createObjectURL(blob));
      },
      reject,
      { binary: true }
    );
  });

export const normalizeObject = (object, targetHeight = 1.2) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  object.position.sub(center);
  const scale = targetHeight / Math.max(size.x, size.y, size.z);
  object.scale.multiplyScalar(scale);
  return object;
};
