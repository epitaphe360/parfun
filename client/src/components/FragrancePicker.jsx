import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const VOLUMES = [15, 30, 50, 75, 100, 200];

const FragrancePicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="picker-panel w-[240px]">
      <p className="picker-title">Nom &amp; Volume</p>

      {/* Visibility toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-600">Afficher sur le flacon</span>
        <button
          type="button"
          onClick={() => { state.showFragranceLabel = !snap.showFragranceLabel; }}
          className={`picker-chip ${snap.showFragranceLabel ? 'active' : ''}`}
        >
          {snap.showFragranceLabel ? 'Activé' : 'Désactivé'}
        </button>
      </div>

      <div className="mb-3">
        <label className="picker-subtitle block mb-1" htmlFor="fragrance-name">
          Nom de la fragrance
        </label>
        <input
          id="fragrance-name"
          type="text"
          value={snap.fragranceName}
          onChange={(e) => { state.fragranceName = e.target.value.slice(0, 28); }}
          placeholder="MON PARFUM"
          maxLength={28}
          disabled={!snap.showFragranceLabel}
          className="w-full text-xs p-2 rounded-md bg-white/70 border border-white/40 outline-none focus:ring-1 focus:ring-[#C9A962] disabled:opacity-50"
        />
      </div>

      <div>
        <p className="picker-subtitle mb-1">Contenance</p>
        <div className="flex flex-wrap gap-1.5">
          {VOLUMES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => { state.volumeMl = v; }}
              className={`picker-chip text-xs ${snap.volumeMl === v ? 'active' : ''}`}
            >
              {v} ml
            </button>
          ))}
        </div>
      </div>

      {/* Size slider */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="picker-subtitle">Taille de l&apos;étiquette</p>
          <span className="text-[10px] text-gray-500">{Math.round((snap.fragranceLabelSize ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.4"
          max="2"
          step="0.05"
          value={snap.fragranceLabelSize ?? 1}
          onChange={(e) => { state.fragranceLabelSize = parseFloat(e.target.value); }}
          disabled={!snap.showFragranceLabel}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FragrancePicker;
