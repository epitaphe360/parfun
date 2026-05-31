import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import {
  findBottle, findPump, findCap, PUMP_COLORS, COATING_OPTIONS,
} from '../config/catalog';
import { findPack, NEXERA } from '../config/nexera';

const dash = (v) => (v && v !== '' ? v : '—');

const SelectionSummary = ({ onContact, onReset, onPrint }) => {
  const snap = useSnapshot(state);
  const bottle = findBottle(snap.bottleCatalogId);
  const pump = findPump(snap.pumpId);
  const cap = findCap(snap.capCatalogId);
  const pumpColorLabel = PUMP_COLORS.find((c) => c.hex === snap.pumpColor)?.label ?? '—';
  const coatingLabel = COATING_OPTIONS.find((c) => c.id === snap.coatingType)?.label ?? '—';
  const pack = findPack(snap.selectedPack);

  return (
    <aside className="summary-panel">
      <h2 className="summary-heading">{NEXERA.name}</h2>

      <section className="summary-block">
        <h3>Projet</h3>
        <dl>
          <div><dt>Univers</dt><dd>{snap.selectedUniverse ?? 'parfumerie'}</dd></div>
          <div><dt>Pack</dt><dd>{pack?.name ?? '—'}</dd></div>
        </dl>
      </section>

      <section className="summary-block">
        <h3>Flacon</h3>
        <dl>
          <div><dt>Nom</dt><dd>{dash(bottle?.name)}</dd></div>
          <div><dt>Catégorie</dt><dd>{dash(bottle?.category)}</dd></div>
          <div><dt>Volume</dt><dd>{bottle?.volumeMl ? `${bottle.volumeMl} ml` : '—'}</dd></div>
        </dl>
      </section>

      <section className="summary-block">
        <h3>Pompe</h3>
        <dl>
          <div><dt>Nom</dt><dd>{snap.showPump ? dash(pump?.name) : 'Aucune'}</dd></div>
          <div><dt>Type</dt><dd>{snap.showPump ? dash(pump?.type) : '—'}</dd></div>
          <div><dt>Couleur</dt><dd>{snap.showPump ? pumpColorLabel : '—'}</dd></div>
        </dl>
      </section>

      <section className="summary-block">
        <h3>Bouchon</h3>
        <dl>
          <div><dt>Nom</dt><dd>{dash(cap?.name)}</dd></div>
          <div><dt>Forme</dt><dd>{dash(cap?.shape)}</dd></div>
          <div><dt>Matériau</dt><dd>{dash(cap?.material)}</dd></div>
          <div><dt>Couleur</dt><dd>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full border border-black/20" style={{ background: cap?.capColor }} />
              {cap?.capFinish}
            </span>
          </dd></div>
        </dl>
      </section>

      <section className="summary-block">
        <h3>Votre design</h3>
        <dl>
          <div><dt>Revêtement</dt><dd>{coatingLabel}</dd></div>
          <div><dt>Couleur flacon</dt><dd>{dash(snap.color)}</dd></div>
          <div><dt>Logo</dt><dd>{snap.isLogoTexture ? 'Fichier ajouté' : '—'}</dd></div>
        </dl>
      </section>

      <div className="summary-actions">
        <button type="button" className="summary-btn primary" onClick={onPrint}>
          Télécharger PDF
        </button>
        <button type="button" className="summary-btn" onClick={onContact}>
          Demander un devis
        </button>
        <button type="button" className="summary-btn ghost" onClick={onReset}>
          Réinitialiser
        </button>
      </div>

      <p className="summary-disclaimer">
        {NEXERA.address}. Les couleurs à l&apos;écran peuvent différer du produit final.
      </p>
    </aside>
  );
};

export default SelectionSummary;
