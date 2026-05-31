import React, { useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { applyConfigRules } from '../utils/configStorage';
import { BOTTLE_CATALOG, BOTTLE_FILTERS } from '../config/catalog';
import { getBottleImage, sortCatalog, BOTTLE_FALLBACK } from '../config/catalogImages';
import CatalogGrid, { FilterChips, CatalogToolbar } from './catalog/CatalogGrid';

const applyBottle = (item) => {
  state.bottleCatalogId = item.id;
  state.bottleType = item.bottleType;
  state.bottleSource = item.bottleSource;
  state.volumeMl = item.volumeMl;
  state.useCustomGlb = false;
  state.capOpen = false;
  state.sprayActive = false;
  applyConfigRules(state);
};

const BottleCatalog = () => {
  const snap = useSnapshot(state);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => {
    if (filter === 'all') return BOTTLE_CATALOG;
    if (filter === 'mini') return BOTTLE_CATALOG.filter((b) => b.category === 'mini' || b.tags?.includes('mini'));
    if (filter === 'screw') return BOTTLE_CATALOG.filter((b) => b.tags?.includes('screw'));
    if (filter === 'polish') return BOTTLE_CATALOG.filter((b) => b.tags?.includes('polish'));
    return BOTTLE_CATALOG.filter((b) => b.category === filter);
  }, [filter]);

  const items = useMemo(() => sortCatalog(filtered, sort), [filtered, sort]);

  return (
    <div className="picker-panel catalog-panel">
      <p className="picker-title">Choisir le flacon</p>
      <FilterChips filters={BOTTLE_FILTERS} active={filter} onChange={setFilter} />
      <CatalogToolbar count={items.length} sort={sort} onSortChange={setSort} />
      <CatalogGrid
        items={items}
        activeId={snap.bottleCatalogId}
        onSelect={applyBottle}
        getImage={getBottleImage}
        getFallback={BOTTLE_FALLBACK}
      />
    </div>
  );
};

export default BottleCatalog;
