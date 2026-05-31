import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { COATING_OPTIONS } from '../config/catalog';
import { COATING_SWATCHES } from '../config/catalogImages';
import { reader } from '../config/helpers';
import { FilePicker, ColorPicker } from './index';

const applyCoating = (id) => {
  state.coatingType = id;
  if (id === 'empty') {
    state.bottleShine = 0.35;
    state.glassRoughness = 0.08;
  } else if (id === 'matte') {
    state.bottleShine = 0.35;
    state.glassRoughness = 0.45;
  } else if (id === 'shiny') {
    state.bottleShine = 0.95;
    state.glassRoughness = 0.02;
  } else if (id === 'icing') {
    state.bottleShine = 0.6;
    state.glassRoughness = 0.25;
  }
};

const DesignStep = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');

  const readFile = (type) => {
    if (!file) return;
    reader(file).then((result) => {
      if (type === 'logo') {
        state.logoDecal = result;
        state.isLogoTexture = true;
      } else {
        state.fullDecal = result;
        state.isFullTexture = true;
      }
      setFile('');
    });
  };

  return (
    <div className="picker-panel catalog-panel">
      <p className="picker-title">Design &amp; finition</p>

      <p className="text-xs font-semibold mb-2 opacity-70">Revêtement</p>
      <div className="coating-grid">
        {COATING_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => applyCoating(opt.id)}
            className={`coating-card ${snap.coatingType === opt.id ? 'active' : ''}`}
          >
            <span
              className="coating-swatch"
              style={{ background: COATING_SWATCHES[opt.id] }}
            />
            <span className="coating-label">{opt.label}</span>
            <span className="coating-sub">{opt.sub}</span>
          </button>
        ))}
      </div>

      {snap.coatingType !== 'empty' && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-2 opacity-70">Couleur de revêtement</p>
          <ColorPicker target="bottle" />
        </div>
      )}

      <div className="mt-4 border-t border-black/10 pt-4">
        <FilePicker file={file} setFile={setFile} readFile={readFile} />
      </div>

      <div className="mt-4 border-t border-black/10 pt-4">
        <p className="text-xs font-semibold mb-2 opacity-70">Étiquette parfum</p>
        <input
          type="text"
          value={snap.fragranceName}
          onChange={(e) => { state.fragranceName = e.target.value; }}
          placeholder="Nom du parfum"
          className="w-full px-3 py-2 text-sm rounded-lg border border-black/10 bg-white/80"
        />
        <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={snap.showFragranceLabel}
            onChange={() => { state.showFragranceLabel = !snap.showFragranceLabel; }}
          />
          Afficher l&apos;étiquette
        </label>
      </div>
    </div>
  );
};

export default DesignStep;
