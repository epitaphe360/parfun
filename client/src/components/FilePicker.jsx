import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import CustomButton from './CustomButton';
import state from '../store';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(url);
  };

  const handleApply = (type) => {
    readFile(type);
    // Keep preview until a new file is selected
  };

  const handleRemove = () => {
    state.isLogoTexture = false;
    state.isFullTexture = false;
    state.logoDecal = TRANSPARENT_PIXEL;
    state.fullDecal = TRANSPARENT_PIXEL;
    setFile('');
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="picker-panel w-[240px]">
      <p className="picker-title">Etiquette &amp; Logo</p>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        1. Choisissez une image PNG/JPG.
        <br />
        2. Cliquez sur le type d'application.
      </p>

      {/* Hidden native input — label acts as button */}
      <input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <label htmlFor="file-upload" className="filepicker-label cursor-pointer block text-center mb-2">
        {file ? 'Changer l\'image' : 'Choisir une image'}
      </label>

      {/* Preview */}
      {preview && (
        <div className="mb-3 rounded-md overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-24 object-contain bg-gray-50"
          />
          <p className="text-[10px] text-gray-400 text-center py-1 truncate px-2">
            {file?.name}
          </p>
        </div>
      )}

      {/* Application buttons — only active when a file is selected */}
      <div className="flex flex-col gap-2 mt-1">
        <button
          type="button"
          disabled={!file}
          onClick={() => handleApply('logo')}
          className={`px-2 py-1.5 text-xs rounded-md border border-[#C9A962] text-[#1A1A1A] hover:bg-white/60 ${!file ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
        >
          Logo (face avant)
        </button>
        <button
          type="button"
          disabled={!file}
          onClick={() => handleApply('full')}
          className={`px-2 py-1.5 text-xs rounded-md bg-[#1A1A1A] text-white hover:bg-[#333] ${!file ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
        >
          Habillage complet
        </button>
      </div>

      {/* Logo size slider */}
      <div className="mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="picker-subtitle">Taille du logo</p>
          <span className="text-[10px] text-gray-500">{Math.round((snap.logoSize ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.4"
          max="2"
          step="0.05"
          value={snap.logoSize ?? 1}
          onChange={(e) => { state.logoSize = parseFloat(e.target.value); }}
          className="w-full"
        />
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <CustomButton
          type="outline"
          title="Retirer étiquettes"
          handleClick={handleRemove}
          customStyles="text-xs w-full"
        />
      </div>
    </div>
  );
};

export default FilePicker;
