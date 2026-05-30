import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const ENVIRONMENTS = [
  { id: 'studio',    label: 'Studio',    icon: '💡' },
  { id: 'sunset',    label: 'Coucher',   icon: '🌅' },
  { id: 'city',      label: 'Ville',     icon: '🌃' },
  { id: 'forest',    label: 'Nature',    icon: '🌿' },
  { id: 'dawn',      label: 'Aube',      icon: '🌄' },
  { id: 'lobby',     label: 'Lobby',     icon: '🏛' },
  { id: 'apartment', label: 'Loft',      icon: '🏠' },
  { id: 'warehouse', label: 'Industriel',icon: '🏭' },
];

const BACKGROUNDS = [
  { id: 'warm',     label: 'Beige luxe',    color: '#EDE4D8' },
  { id: 'white',    label: 'Studio blanc',  color: '#FAFAFA' },
  { id: 'dark',     label: 'Noir',          color: '#111111' },
  { id: 'midnight', label: 'Minuit bleu',   color: '#141428' },
];

const EnvironmentPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="picker-panel w-[240px]">
      <p className="picker-title">Ambiance &amp; Lumière</p>

      <p className="picker-subtitle mb-1">Environnement HDRI</p>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env.id}
            type="button"
            onClick={() => { state.environment = env.id; }}
            className={`picker-option py-1.5 flex items-center gap-1.5 text-left ${
              snap.environment === env.id ? 'active' : ''
            }`}
          >
            <span className="text-base leading-none">{env.icon}</span>
            <span>{env.label}</span>
          </button>
        ))}
      </div>

      <p className="picker-subtitle mb-1">Fond de scène</p>
      <div className="flex gap-2 mb-3">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            type="button"
            onClick={() => { state.bgMode = bg.id; }}
            title={bg.label}
            className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 transition-all ${
              snap.bgMode === bg.id ? 'border-[#C9A962] scale-110' : 'border-white/50'
            }`}
            style={{ background: bg.color }}
          />
        ))}
      </div>

      <p className="picker-subtitle mb-1">Iridescence du verre</p>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={snap.bottleShine}
          onChange={(e) => { state.bottleShine = parseFloat(e.target.value); }}
          className="liquid-slider flex-1"
        />
        <span className="text-xs text-gray-500 w-8 text-right">
          {Math.round(snap.bottleShine * 100)}%
        </span>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        Effet arc-en-ciel caractéristique du verre de luxe.
      </p>
    </div>
  );
};

export default EnvironmentPicker;
