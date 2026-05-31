import React, { useMemo, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CAP_CATALOG, CAP_FILTERS } from '../config/catalog';
import { getCapImage, sortCatalog, CAP_FALLBACK } from '../config/catalogImages';
import CatalogGrid, { FilterChips, CatalogToolbar } from './catalog/CatalogGrid';

const applyCap = (item) => {
  state.capCatalogId = item.id;
  state.capType = item.capType;
  state.capFinish = item.capFinish;
  state.capColor = item.capColor;
  state.showCap = true;
  state.showPump = false;
};

const CapCatalog = () => {
  const snap = useSnapshot(state);
  const [catFilter, setCatFilter] = useState('all');
  const [shapeFilter, setShapeFilter] = useState('all');
  const [matFilter, setMatFilter] = useState('all');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => CAP_CATALOG.filter((c) => {
    if (catFilter !== 'all' && c.category !== catFilter) return false;
    if (shapeFilter !== 'all' && c.shape !== shapeFilter) return false;
    if (matFilter !== 'all' && c.material !== matFilter) return false;
    return true;
  }), [catFilter, shapeFilter, matFilter]);

  const items = useMemo(() => sortCatalog(filtered, sort), [filtered, sort]);

  return (
    <div className="picker-panel catalog-panel">
      <p className="picker-title">Bouchons</p>
      <FilterChips filters={CAP_FILTERS.category} active={catFilter} onChange={setCatFilter} />
      <FilterChips filters={CAP_FILTERS.shape} active={shapeFilter} onChange={setShapeFilter} />
      <FilterChips filters={CAP_FILTERS.material} active={matFilter} onChange={setMatFilter} />
      <CatalogToolbar count={items.length} sort={sort} onSortChange={setSort} />
      <CatalogGrid
        items={items}
        activeId={snap.capCatalogId}
        onSelect={applyCap}
        getImage={getCapImage}
        getFallback={CAP_FALLBACK}
        getAccent={(item) => item.capColor}
      />

      <div className="mt-3 border-t border-black/10 pt-3">
        <p className="text-xs font-semibold mb-2 opacity-70">Couleur personnalisée</p>
        <SketchPicker
          color={snap.capColor}
          disableAlpha
          onChange={(color) => { state.capColor = color.hex; }}
        />
      </div>
    </div>
  );
};

export default CapCatalog;
