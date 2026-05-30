import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { PRESETS } from '../config/presets';
import { applyConfigRules } from '../utils/configStorage';

const PresetPicker = () => {
  const snap = useSnapshot(state);

  const FULL_KEYS = [
    'color', 'liquidColor', 'capColor', 'capType', 'capFinish',
    'bottleType', 'bottleSource', 'environment', 'bgMode',
    'liquidLevel', 'bottleShine',
    'fragranceName', 'volumeMl', 'showFragranceLabel',
    'showEngraving', 'engravingText', 'engravingFont', 'engravingColor',
  ];

  const apply = (preset) => {
    state.preset = preset.id;
    FULL_KEYS.forEach((k) => { if (preset[k] !== undefined) state[k] = preset[k]; });
    state.showFragranceLabel = true;
    state.useCustomGlb = false;
    state.bottleSource = preset.bottleSource ?? 'glb';
    applyConfigRules(state);
  };

  return (
    <div className="picker-panel presets-grid w-[240px]">
      <p className="picker-title">Collections</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => apply(preset)}
            className={`preset-card ${snap.preset === preset.id ? 'active' : ''}`}
          >
            <div className="flex gap-1 mb-1">
              <span className="preset-swatch" style={{ background: preset.color }} />
              <span className="preset-swatch" style={{ background: preset.liquidColor }} />
              <span className="preset-swatch" style={{ background: preset.capColor }} />
            </div>
            <span className="text-xs font-bold">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetPicker;
