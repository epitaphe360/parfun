import React from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CapFinishes } from '../config/constants';

const capOptions = [
  { id: 'classic', label: 'Classique', description: 'Cylindrique' },
  { id: 'dome',    label: 'Dôme',      description: 'Arrondi' },
  { id: 'modern',  label: 'Moderne',   description: 'Cubique' },
];

const CapPicker = () => {
  const snap = useSnapshot(state);
  const isGlb = snap.bottleSource === 'glb' || snap.useCustomGlb;

  return (
    <div className="picker-panel w-[220px]">
      <p className="picker-title">Bouchon</p>

      {/* Colour applies to both the native GLB cap and a procedural Cap */}
      <p className="picker-subtitle mt-1 mb-1">Couleur</p>
      <SketchPicker
        color={snap.capColor}
        disableAlpha
        onChange={(color) => { state.capColor = color.hex; }}
      />

      {/* Procedural Cap controls — only shown when not GLB, or when user has
          explicitly added a procedural cap on top of the GLB */}
      {isGlb ? (
        <>
          <div className="divider my-3" />
          <div className="flex items-center justify-between">
            <span className="picker-subtitle">Bouchon procédural supplémentaire</span>
            <button
              type="button"
              onClick={() => { state.showCap = !snap.showCap; }}
              className={`picker-chip ${snap.showCap ? 'active' : ''}`}
            >
              {snap.showCap ? 'Activé' : 'Désactivé'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
            Le modèle GLB possède un bouchon natif déjà affiché. Activez ce toggle pour empiler un bouchon procédural supplémentaire (rarement nécessaire).
          </p>
        </>
      ) : (
        <>
          <div className="divider my-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="picker-subtitle">Afficher le bouchon</span>
            <button
              type="button"
              onClick={() => { state.showCap = !snap.showCap; }}
              className={`picker-chip ${snap.showCap ? 'active' : ''}`}
            >
              {snap.showCap ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </>
      )}

      {/* Type + finition — only relevant when a procedural Cap is rendered */}
      {snap.showCap && (
        <>
          <p className="picker-subtitle mt-3">Type</p>
          {capOptions.map((cap) => (
            <button
              key={cap.id}
              type="button"
              onClick={() => { state.capType = cap.id; }}
              className={`picker-option flex justify-between ${snap.capType === cap.id ? 'active' : ''}`}
            >
              <span className="font-bold">{cap.label}</span>
              <span className="opacity-70">{cap.description}</span>
            </button>
          ))}

          <p className="picker-subtitle mt-3">Finition</p>
          <div className="picker-row">
            {CapFinishes.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => { state.capFinish = f.id; }}
                className={`picker-chip ${snap.capFinish === f.id ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CapPicker;
