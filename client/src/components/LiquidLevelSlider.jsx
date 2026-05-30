import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';

const LiquidLevelSlider = () => {
  const snap = useSnapshot(state);

  return (
    <div className="picker-panel w-[220px]">
      <p className="picker-title">Niveau de jus</p>
      <input
        type="range"
        min="0.05"
        max="0.95"
        step="0.01"
        value={snap.liquidLevel}
        onChange={(e) => { state.liquidLevel = parseFloat(e.target.value); }}
        className="liquid-slider w-full"
      />
      <p className="text-xs text-gray-600 mt-2 text-center">
        {Math.round(snap.liquidLevel * 100)}%
      </p>
    </div>
  );
};

export default LiquidLevelSlider;
