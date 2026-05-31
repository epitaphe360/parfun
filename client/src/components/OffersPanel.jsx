import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { NEXERA_PACKS } from '../config/nexera';

const OffersPanel = () => {
  const snap = useSnapshot(state);
  const [active, setActive] = useState(snap.selectedPack ?? 'starter');

  const selectPack = (id) => {
    setActive(id);
    state.selectedPack = id;
  };

  const pack = NEXERA_PACKS.find((p) => p.id === active) ?? NEXERA_PACKS[0];

  return (
    <div className="picker-panel catalog-panel">
      <p className="picker-title">Nos offres</p>
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        Lancez votre marque cosmétique sans complexité. Laboratoire intégré, conformité UE, time-to-market optimisé.
      </p>

      <div className="filter-row mb-3">
        {NEXERA_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => selectPack(p.id)}
            className={`filter-chip ${active === p.id ? 'active' : ''}`}
          >
            {p.name.replace('Pack ', '')}
          </button>
        ))}
      </div>

      <div className="offer-card active">
        <h3 className="offer-name">{pack.name}</h3>
        <p className="offer-sub">{pack.subtitle}</p>
        <p className="text-xs text-gray-600 mt-2 mb-2">{pack.objective}</p>
        <ul className="offer-list">
          {pack.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
        Pack sélectionné enregistré pour votre demande de devis.
      </p>
    </div>
  );
};

export default OffersPanel;
