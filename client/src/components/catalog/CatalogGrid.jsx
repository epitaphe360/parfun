import React from 'react';

import CatalogThumb from './CatalogThumb';

const CatalogGrid = ({ items, activeId, onSelect, getImage, getFallback, getAccent }) => (
  <div className="catalog-grid">
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect(item)}
        className={`catalog-card ${activeId === item.id ? 'active' : ''}`}
      >
        <CatalogThumb
          src={getImage?.(item)}
          fallbackSrc={getFallback?.(item)}
          alt={item.name}
          accentColor={getAccent?.(item)}
        />
        <div className="catalog-card-body">
          <span className="catalog-name">{item.name}</span>
          {item.volumeMl && <span className="catalog-meta">{item.volumeMl} ml</span>}
          {item.category && !item.volumeMl && (
            <span className="catalog-meta">{item.category}</span>
          )}
        </div>
        {activeId === item.id && <span className="catalog-check">✓</span>}
      </button>
    ))}
  </div>
);

export const FilterChips = ({ filters, active, onChange }) => (
  <div className="filter-row">
    {filters.map((f) => (
      <button
        key={f.id}
        type="button"
        onClick={() => onChange(f.id)}
        className={`filter-chip ${active === f.id ? 'active' : ''}`}
      >
        {f.label}
      </button>
    ))}
  </div>
);

export const CatalogToolbar = ({ count, sort, onSortChange }) => (
  <div className="catalog-toolbar">
    <span className="catalog-count">{count} modèle{count > 1 ? 's' : ''}</span>
    <select
      className="catalog-sort"
      value={sort}
      onChange={(e) => onSortChange(e.target.value)}
      aria-label="Trier le catalogue"
    >
      <option value="default">Tri : Défaut</option>
      <option value="az">A → Z</option>
      <option value="za">Z → A</option>
    </select>
  </div>
);

export default CatalogGrid;
