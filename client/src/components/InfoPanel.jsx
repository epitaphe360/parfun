import React from 'react';

import { NEXERA, NEXERA_PILLARS, NEXERA_AUDIENCES, NEXERA_GOODIES } from '../config/nexera';

const InfoPanel = () => (
  <div className="picker-panel catalog-panel">
    <p className="picker-title">{NEXERA.name}</p>
    <div className="info-content">
      <p>
        {NEXERA.name} est spécialisée dans la <strong>création de marques blanches</strong>,
        avec {NEXERA.experience}. Modèle 360° : développement produit, structuration de marque,
        conformité réglementaire UE, production dès MOQ 1.
      </p>

      <p className="text-xs font-bold uppercase tracking-wider opacity-60 mt-3 mb-1">Notre accompagnement</p>
      <ul className="space-y-2">
        {NEXERA_PILLARS.map((p) => (
          <li key={p.id}><strong>{p.title}</strong> — {p.desc}</li>
        ))}
      </ul>

      <p className="text-xs font-bold uppercase tracking-wider opacity-60 mt-3 mb-1">À qui s&apos;adresse NEXERA ?</p>
      <ul>
        {NEXERA_AUDIENCES.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>

      <p className="text-xs font-bold uppercase tracking-wider opacity-60 mt-3 mb-1">Goodies inclus (packs)</p>
      <ul>
        {NEXERA_GOODIES.slice(0, 4).map((g) => (
          <li key={g}>{g}</li>
        ))}
        <li className="opacity-60">… et plus</li>
      </ul>

      <p className="text-xs opacity-60 mt-4">{NEXERA.address}</p>

      <p className="text-xs opacity-60 mt-2">
        <strong>Configurateur 3D :</strong> les couleurs à l&apos;écran peuvent différer du produit final.
        Les finitions mat/brillant/givré sont approximées en 3D.
      </p>
    </div>
  </div>
);

export default InfoPanel;
