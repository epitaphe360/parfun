import React, { useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { PUMP_CATALOG, PUMP_FILTERS, PUMP_COLORS, pumpColorHex } from '../config/catalog';
import { getPumpImage, sortCatalog, PUMP_FALLBACK } from '../config/catalogImages';
import CatalogGrid, { FilterChips, CatalogToolbar } from './catalog/CatalogGrid';

const applyPump = (item) => {
  state.pumpId = item.id;
  state.pumpType = item.type;
  state.pumpColor = pumpColorHex(item.colorId);
  state.showPump = true;
};

const PumpCatalog = () => {
  const snap = useSnapshot(state);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => {
    if (filter === 'all') return PUMP_CATALOG;
    return PUMP_CATALOG.filter((p) => p.type === filter);
  }, [filter]);

  const items = useMemo(() => sortCatalog(filtered, sort), [filtered, sort]);

  return (
    <div className="picker-panel catalog-panel">
      <p className="picker-title">Pompes / Valves</p>
      <FilterChips filters={PUMP_FILTERS} active={filter} onChange={setFilter} />
      <div className="filter-row mb-2">
        {PUMP_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            onClick={() => { state.pumpColor = c.hex; }}
            className={`color-dot ${snap.pumpColor === c.hex ? 'selected' : ''}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
      <CatalogToolbar count={items.length} sort={sort} onSortChange={setSort} />
      <CatalogGrid
        items={items}
        activeId={snap.pumpId}
        onSelect={applyPump}
        getImage={getPumpImage}
        getFallback={PUMP_FALLBACK}
        getAccent={(item) => pumpColorHex(item.colorId)}
      />
      <label className="catalog-toggle">
        <input
          type="checkbox"
          checked={snap.showPump}
          onChange={() => { state.showPump = !snap.showPump; }}
        />
        Afficher la pompe sur le flacon
      </label>
      {snap.bottleSource === 'glb' && snap.showPump && (
        <p className="catalog-hint">
          Le bouchon d&apos;origine est remplacé par la pompe sélectionnée.
        </p>
      )}
    </div>
  );
};

export default PumpCatalog;
