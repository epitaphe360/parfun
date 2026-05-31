/** Catalogues style Erbatur — mappés sur le moteur 3D existant */

export const BOTTLE_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: '50ml', label: '50 ml' },
  { id: '100ml', label: '100 ml' },
  { id: 'mini', label: 'Mini' },
  { id: 'screw', label: 'Col à vis' },
  { id: 'polish', label: 'Polish' },
];

export const BOTTLE_CATALOG = [
  { id: 'glb-classic', name: 'Classique', category: '50ml', bottleSource: 'glb', bottleType: 'elegant', volumeMl: 50, tags: ['polish'] },
  { id: 'elegant-100', name: 'Élégant', category: '100ml', bottleSource: 'procedural', bottleType: 'elegant', volumeMl: 100, tags: [] },
  { id: 'slender-50', name: 'Élancé', category: '50ml', bottleSource: 'procedural', bottleType: 'slender', volumeMl: 50, tags: ['screw'] },
  { id: 'round-100', name: 'Rond', category: '100ml', bottleSource: 'procedural', bottleType: 'round', volumeMl: 100, tags: ['polish'] },
  { id: 'vintage-75', name: 'Vintage', category: '100ml', bottleSource: 'procedural', bottleType: 'vintage', volumeMl: 75, tags: ['polish'] },
  { id: 'square-100', name: 'Carré', category: '100ml', bottleSource: 'procedural', bottleType: 'square', volumeMl: 100, tags: [] },
  { id: 'hex-50', name: 'Hexagonal', category: '50ml', bottleSource: 'procedural', bottleType: 'hexagonal', volumeMl: 50, tags: ['screw'] },
  { id: 'mini-round', name: 'Mini Rond', category: 'mini', bottleSource: 'procedural', bottleType: 'round', volumeMl: 30, tags: ['mini'] },
  { id: 'slender-mini', name: 'Mini Élancé', category: 'mini', bottleSource: 'procedural', bottleType: 'slender', volumeMl: 30, tags: ['mini', 'screw'] },
  { id: 'vintage-polish', name: 'Vintage Polish', category: '100ml', bottleSource: 'procedural', bottleType: 'vintage', volumeMl: 100, tags: ['polish'] },
];

export const PUMP_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'collar', label: 'Avec collerette' },
  { id: 'plain', label: 'Sans collerette' },
  { id: 'step', label: 'Step' },
];

export const PUMP_COLORS = [
  { id: 'gold', label: 'Doré', hex: '#D4AF37' },
  { id: 'silver', label: 'Argent', hex: '#C0C0C0' },
  { id: 'black', label: 'Noir', hex: '#1A1A1A' },
  { id: 'rose', label: 'Or rose', hex: '#B76E79' },
];

export const PUMP_CATALOG = [
  { id: 'pump-collar-gold', name: '15 mm collerette', type: 'collar', colorId: 'gold' },
  { id: 'pump-collar-silver', name: '15 mm collerette', type: 'collar', colorId: 'silver' },
  { id: 'pump-collar-black', name: '15 mm collerette', type: 'collar', colorId: 'black' },
  { id: 'pump-collar-rose', name: '15 mm collerette', type: 'collar', colorId: 'rose' },
  { id: 'pump-plain-gold', name: '15 mm standard', type: 'plain', colorId: 'gold' },
  { id: 'pump-plain-silver', name: '15 mm standard', type: 'plain', colorId: 'silver' },
  { id: 'pump-plain-black', name: '15 mm standard', type: 'plain', colorId: 'black' },
  { id: 'pump-step-silver', name: '15 mm step', type: 'step', colorId: 'silver' },
  { id: 'pump-step-gold', name: '15 mm step', type: 'step', colorId: 'gold' },
  { id: 'pump-step-black', name: '15 mm step', type: 'step', colorId: 'black' },
];

export const CAP_FILTERS = {
  category: [
    { id: 'all', label: 'Tous' },
    { id: 'collar', label: 'Avec collerette' },
    { id: 'plain', label: 'Sans collerette' },
    { id: 'step', label: 'Eteksiz step' },
  ],
  shape: [
    { id: 'all', label: 'Toutes formes' },
    { id: 'round', label: 'Rond' },
    { id: 'cylinder', label: 'Cylindre' },
    { id: 'shaped', label: 'Forme spéciale' },
  ],
  material: [
    { id: 'all', label: 'Tous matériaux' },
    { id: 'metal', label: 'Métal' },
    { id: 'matte', label: 'Mat' },
    { id: 'wood', label: 'Bois' },
  ],
};

export const CAP_CATALOG = [
  { id: 'classic-gold', name: 'Classique', capType: 'classic', capFinish: 'gold', capColor: '#D4AF37', category: 'collar', shape: 'cylinder', material: 'metal' },
  { id: 'classic-silver', name: 'Classique', capType: 'classic', capFinish: 'silver', capColor: '#C0C0C0', category: 'collar', shape: 'cylinder', material: 'metal' },
  { id: 'classic-black', name: 'Classique', capType: 'classic', capFinish: 'matte', capColor: '#1A1A1A', category: 'plain', shape: 'cylinder', material: 'matte' },
  { id: 'dome-gold', name: 'Dôme', capType: 'dome', capFinish: 'gold', capColor: '#D4AF37', category: 'plain', shape: 'round', material: 'metal' },
  { id: 'dome-silver', name: 'Dôme', capType: 'dome', capFinish: 'silver', capColor: '#C0C0C0', category: 'plain', shape: 'round', material: 'metal' },
  { id: 'dome-rose', name: 'Dôme', capType: 'dome', capFinish: 'gold', capColor: '#B76E79', category: 'plain', shape: 'round', material: 'metal' },
  { id: 'modern-black', name: 'Moderne', capType: 'modern', capFinish: 'matte', capColor: '#1A1A1A', category: 'plain', shape: 'shaped', material: 'matte' },
  { id: 'modern-white', name: 'Moderne', capType: 'modern', capFinish: 'matte', capColor: '#F5F5F5', category: 'step', shape: 'shaped', material: 'matte' },
  { id: 'modern-gold', name: 'Moderne', capType: 'modern', capFinish: 'gold', capColor: '#D4AF37', category: 'collar', shape: 'shaped', material: 'metal' },
  { id: 'dome-black', name: 'Dôme Noir', capType: 'dome', capFinish: 'matte', capColor: '#222222', category: 'plain', shape: 'round', material: 'matte' },
  { id: 'classic-rose', name: 'Classique Or rose', capType: 'classic', capFinish: 'gold', capColor: '#B76E79', category: 'collar', shape: 'cylinder', material: 'metal' },
  { id: 'dome-step', name: 'Dôme Step', capType: 'dome', capFinish: 'silver', capColor: '#A8A8A8', category: 'step', shape: 'round', material: 'metal' },
];

export const COATING_OPTIONS = [
  { id: 'empty', label: 'Vide', sub: 'Sans revêtement' },
  { id: 'matte', label: 'Mat', sub: 'Couleur mate' },
  { id: 'shiny', label: 'Brillant', sub: 'Couleur brillante' },
  { id: 'icing', label: 'Givré', sub: 'Effet givré' },
];

export const findBottle = (id) => BOTTLE_CATALOG.find((b) => b.id === id) ?? BOTTLE_CATALOG[0];
export const findPump = (id) => PUMP_CATALOG.find((p) => p.id === id) ?? PUMP_CATALOG[0];
export const findCap = (id) => CAP_CATALOG.find((c) => c.id === id) ?? CAP_CATALOG[0];
export const pumpColorHex = (colorId) => PUMP_COLORS.find((c) => c.id === colorId)?.hex ?? '#D4AF37';
