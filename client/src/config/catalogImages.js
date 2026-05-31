/** Vignettes catalogue — photos JPG dans public/catalog/photos/ */

const PHOTO = {
  bottles: (name) => `/catalog/photos/bottles/${name}.jpg`,
  pumps: (name) => `/catalog/photos/pumps/${name}.jpg`,
  caps: (name) => `/catalog/photos/caps/${name}.jpg`,
  univers: (name) => `/catalog/photos/univers/${name}.jpg`,
};

const SVG = {
  bottles: (name) => `/catalog/bottles/${name}.svg`,
  pumps: (name) => `/catalog/pumps/${name}.svg`,
  caps: (name) => `/catalog/caps/${name}.svg`,
  univers: (name) => `/catalog/univers/${name}.svg`,
};

/** Une photo JPG par entrée du catalogue flacon */
export const BOTTLE_PHOTOS = {
  'glb-classic': PHOTO.bottles('glb-classic'),
  'elegant-100': PHOTO.bottles('elegant-100'),
  'slender-50': PHOTO.bottles('slender-50'),
  'round-100': PHOTO.bottles('round-100'),
  'vintage-75': PHOTO.bottles('vintage-75'),
  'square-100': PHOTO.bottles('square-100'),
  'hex-50': PHOTO.bottles('hex-50'),
  'mini-round': PHOTO.bottles('mini-round'),
  'slender-mini': PHOTO.bottles('slender-mini'),
  'vintage-polish': PHOTO.bottles('vintage-polish'),
};

/** Photo par type de pompe (collar / plain / step) */
export const PUMP_PHOTOS = {
  collar: PHOTO.pumps('collar'),
  plain: PHOTO.pumps('plain'),
  step: PHOTO.pumps('step'),
};

/** Photo par forme de bouchon (classic / dome / modern) */
export const CAP_PHOTOS = {
  classic: PHOTO.caps('classic'),
  dome: PHOTO.caps('dome'),
  modern: PHOTO.caps('modern'),
};

export const UNIVERSE_IMAGES = {
  skincare: PHOTO.univers('skincare'),
  capillaire: PHOTO.univers('capillaire'),
  parfumerie: PHOTO.univers('parfumerie'),
};

/** SVG de secours si la photo ne charge pas (CatalogThumb onError) */
export const BOTTLE_FALLBACK = (item) => {
  const key = item.id === 'glb-classic' ? 'glb-classic' : (item.bottleType || 'elegant');
  return SVG.bottles(key);
};

export const PUMP_FALLBACK = (item) => SVG.pumps(item.type || 'collar');

export const CAP_FALLBACK = (item) => SVG.caps(item.capType || 'classic');

export const UNIVERSE_FALLBACK = (id) => SVG.univers(id);

export const getBottleImage = (item) => item?.image ?? BOTTLE_PHOTOS[item?.id] ?? PHOTO.bottles(item?.id);

export const getPumpImage = (item) => item?.image ?? PUMP_PHOTOS[item?.type] ?? PHOTO.pumps('collar');

export const getCapImage = (item) => item?.image ?? CAP_PHOTOS[item?.capType] ?? PHOTO.caps('classic');

export const COATING_SWATCHES = {
  empty: 'linear-gradient(135deg, #f5f0eb 0%, #e8e0d4 100%)',
  matte: 'linear-gradient(135deg, #c4b8a8 0%, #9a8e7e 100%)',
  shiny: 'linear-gradient(135deg, #fff8f0 0%, #d4af37 50%, #fff8f0 100%)',
  icing: 'linear-gradient(135deg, #e8eef5 0%, #b8c8d8 100%)',
};

export const SORT_OPTIONS = [
  { id: 'default', label: 'Défaut' },
  { id: 'az', label: 'A → Z' },
  { id: 'za', label: 'Z → A' },
];

export const sortCatalog = (items, sortId) => {
  const list = [...items];
  if (sortId === 'az') return list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  if (sortId === 'za') return list.sort((a, b) => b.name.localeCompare(a.name, 'fr'));
  return list;
};
