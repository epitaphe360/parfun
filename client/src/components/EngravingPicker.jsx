import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const COLORS = ['#D4AF37', '#FFFFFF', '#1A1A1A', '#C0C0C0', '#B87333', '#8B0000'];

const EngravingPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="picker-panel w-[240px]">
      <p className="picker-title">Gravure personnalisée</p>

      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-600">Gravure sur flacon</span>
        <button
          type="button"
          onClick={() => { state.showEngraving = !snap.showEngraving; }}
          className={`picker-chip ${snap.showEngraving ? 'active' : ''}`}
        >
          {snap.showEngraving ? 'Activée' : 'Désactivée'}
        </button>
      </div>

      {/* Text input */}
      <div className="mb-3">
        <label className="picker-subtitle block mb-1" htmlFor="engraving-text">
          Texte (30 car. max)
        </label>
        <input
          id="engraving-text"
          type="text"
          value={snap.engravingText}
          onChange={(e) => { state.engravingText = e.target.value.slice(0, 30); }}
          placeholder="MON PARFUM"
          className="w-full text-xs p-2 rounded-md bg-white/70 border border-white/40 outline-none focus:ring-1 focus:ring-[#C9A962]"
          maxLength={30}
          disabled={!snap.showEngraving}
        />
      </div>

      {/* Font */}
      <div className="mb-3">
        <p className="picker-subtitle mb-1">Police</p>
        <div className="picker-row">
          {[{ id: 'serif', label: 'Serif' }, { id: 'sans', label: 'Sans-serif' }].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => { state.engravingFont = f.id; }}
              className={`picker-chip ${snap.engravingFont === f.id ? 'active' : ''}`}
              disabled={!snap.showEngraving}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color swatches */}
      <div>
        <p className="picker-subtitle mb-1">Couleur de la gravure</p>
        <div className="flex flex-wrap gap-2 items-center">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { state.engravingColor = c; }}
              disabled={!snap.showEngraving}
              title={c}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                snap.engravingColor === c ? 'border-[#C9A962] scale-110' : 'border-white/50'
              }`}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={snap.engravingColor}
            onChange={(e) => { state.engravingColor = e.target.value; }}
            disabled={!snap.showEngraving}
            className="w-7 h-7 rounded-full cursor-pointer border-0"
            title="Couleur personnalisée"
          />
        </div>
      </div>

      {/* Size slider */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="picker-subtitle">Taille</p>
          <span className="text-[10px] text-gray-500">{Math.round((snap.engravingSize ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.4"
          max="2"
          step="0.05"
          value={snap.engravingSize ?? 1}
          onChange={(e) => { state.engravingSize = parseFloat(e.target.value); }}
          disabled={!snap.showEngraving}
          className="w-full"
        />
      </div>

      {snap.showEngraving && (
        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
          La gravure apparaît sur la face avant du flacon. Tournez-le pour voir la combinaison bouchon + gravure.
        </p>
      )}
    </div>
  );
};

export default EngravingPicker;
