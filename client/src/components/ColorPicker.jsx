import React from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store';

const ColorPicker = ({ target = 'bottle' }) => {
  const snap = useSnapshot(state);
  const colorKey = target === 'liquid' ? 'liquidColor' : target === 'cap' ? 'capColor' : 'color';
  const label =
    target === 'liquid' ? 'Couleur du liquide' : target === 'cap' ? 'Couleur du bouchon' : 'Couleur du flacon';

  return (
    <div className="picker-panel w-[220px]">
      <p className="picker-title">{label}</p>
      <SketchPicker
        color={snap[colorKey]}
        disableAlpha
        onChange={(color) => {
          state[colorKey] = color.hex;
        }}
      />
    </div>
  );
};

export default ColorPicker;
