import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const BOTTLE_TYPES = [
  { id: 'elegant',    label: 'Élégant',    desc: 'Silhouette classique' },
  { id: 'slender',    label: 'Élancé',     desc: 'Haute et fine' },
  { id: 'round',      label: 'Rond',       desc: 'Forme douce' },
  { id: 'vintage',    label: 'Vintage',    desc: 'Flacon évasé' },
  { id: 'square',     label: 'Carré',      desc: 'Style moderne' },
  { id: 'hexagonal',  label: 'Hexagonal',  desc: 'Facettes géométriques' },
];

const BottlePicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="picker-panel w-[260px]">
      <p className="picker-title">Flacon</p>

      {/* Source toggle */}
      <div className="picker-row mb-3">
        {[
          { id: 'glb',        label: 'Modèle GLB' },
          { id: 'procedural', label: 'Procédural' },
        ].map((src) => (
          <button
            key={src.id}
            type="button"
            onClick={() => {
              state.bottleSource = src.id;
              state.useCustomGlb = false;
              state.showCap = src.id === 'procedural';
              state.capOpen = false;
              if (src.id === 'glb') {
                state.importStatus = 'idle';
                state.importError = '';
              }
            }}
            className={`picker-chip ${
              snap.bottleSource === src.id && !snap.useCustomGlb ? 'active' : ''
            }`}
          >
            {src.label}
          </button>
        ))}
      </div>

      {/* Procedural shape selector */}
      {snap.bottleSource === 'procedural' && (
        <>
          <p className="picker-subtitle mb-1">Forme du flacon</p>
          <div className="flex flex-col gap-1">
            {BOTTLE_TYPES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { state.bottleType = b.id; }}
                className={`picker-option flex justify-between ${snap.bottleType === b.id ? 'active' : ''}`}
              >
                <span className="font-bold">{b.label}</span>
                <span className="opacity-60">{b.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BottlePicker;
