import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import CustomButton from './CustomButton';

const PhotoToGlbPicker = () => {
  const snap = useSnapshot(state);
  const [localFile, setLocalFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      state.importStatus = 'error';
      state.importError = 'Format invalide. Importez un fichier .glb ou .gltf.';
      return;
    }

    state.importStatus = 'loading';
    state.importError = '';
    if (snap.customGlbUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(snap.customGlbUrl);
    }
    const url = URL.createObjectURL(file);
    state.customGlbUrl = url;
    state.useCustomGlb = true;
    state.bottleSource = 'glb';
    // importStatus stays 'loading' until CustomGlbBottle finishes loading the model
  };

  const reset = () => {
    if (snap.customGlbUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(snap.customGlbUrl);
    }
    state.useCustomGlb = false;
    state.customGlbUrl = null;
    state.importStatus = 'idle';
    state.importError = '';
    state.bottleSource = 'glb';
    setLocalFile(null);
  };

  return (
    <div className="picker-panel w-[220px]">
      <p className="picker-title">Import GLB</p>
      <p className="text-xs text-gray-500 mb-3">
        Importez un fichier 3D réel `.glb/.gltf` pour remplacer le flacon actuel.
      </p>

      <input
        id="glb-upload"
        type="file"
        accept=".glb,.gltf"
        onChange={handleFile}
        className="hidden"
      />
      <label htmlFor="glb-upload" className="filepicker-label cursor-pointer block text-center mb-2">
        Choisir un GLB
      </label>

      {localFile && <p className="text-xs truncate text-gray-500 mb-2">{localFile.name}</p>}

      {snap.importStatus === 'loading' && <p className="text-xs text-gray-600 mb-2">Chargement du modèle...</p>}
      {snap.importStatus === 'done' && (
        <p className="text-xs text-green-700 font-semibold mb-2">Modèle 3D importé avec succès.</p>
      )}
      {snap.importStatus === 'error' && <p className="text-xs text-red-700 mb-2">{snap.importError}</p>}

      {snap.useCustomGlb && (
        <CustomButton type="outline" title="Réinitialiser" handleClick={reset} customStyles="text-xs w-full" />
      )}
    </div>
  );
};

export default PhotoToGlbPicker;
