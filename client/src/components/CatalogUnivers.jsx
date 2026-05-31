import React, { useState } from 'react';

import { NEXERA_UNIVERS } from '../config/nexera';
import { UNIVERSE_IMAGES, UNIVERSE_FALLBACK } from '../config/catalogImages';
import CatalogThumb from './catalog/CatalogThumb';
import state from '../store';

const CatalogUnivers = ({ onStartConfigurator }) => {
  const [active, setActive] = useState('parfumerie');
  const universe = NEXERA_UNIVERS.find((u) => u.id === active) ?? NEXERA_UNIVERS[2];

  return (
    <div className="catalog-univers">
      <div className="univers-tabs">
        {NEXERA_UNIVERS.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setActive(u.id)}
            className={`univers-tab ${active === u.id ? 'active' : ''}`}
          >
            {u.label}
          </button>
        ))}
      </div>

      <div className="univers-hero">
        <CatalogThumb
          src={UNIVERSE_IMAGES[active]}
          fallbackSrc={UNIVERSE_FALLBACK(active)}
          alt={universe.label}
          size="wide"
        />
        <div className="univers-hero-text">
          <h3 className="univers-title">{universe.label}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{universe.desc}</p>
        </div>
      </div>

      <div className="univers-products">
        {universe.products.map((prod) => (
          <span key={prod} className="univers-chip">{prod}</span>
        ))}
      </div>

      {universe.configurator ? (
        <button
          type="button"
          className="univers-cta"
          onClick={() => {
            state.selectedUniverse = universe.id;
            if (onStartConfigurator) onStartConfigurator();
            else state.intro = false;
          }}
        >
          Configurer en 3D →
        </button>
      ) : (
        <p className="catalog-hint">
          Configurateur 3D disponible pour la parfumerie. Contactez NEXERA pour {universe.label.toLowerCase()}.
        </p>
      )}
    </div>
  );
};

export default CatalogUnivers;
