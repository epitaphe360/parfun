/** Contenu NEXERA GROUP — source : présentation commerciale NEXERA */

export const NEXERA = {
  name: 'NEXERA GROUP',
  tagline: 'Marque blanche cosmétique — modèle 360°',
  address: 'Via Augusta, 24-30, 08006 Barcelone, Espagne',
  email: 'contact@nexera-group.com',
  experience: '20+ ans d\'expertise cosmétique',
};

export const NEXERA_PILLARS = [
  { id: 'product', title: 'Développement produit', desc: '100+ formules, tests cliniques et dermatologiques.' },
  { id: 'brand', title: 'Structuration de marque', desc: 'Naming, identité visuelle, packagings cohérents.' },
  { id: 'com', title: 'Communication', desc: 'Stratégie marketing, storytelling, accompagnement commercial.' },
  { id: 'ops', title: 'Services opérationnels', desc: 'Réglementation UE, production, PLV, goodies, suivi post-lancement.' },
];

export const NEXERA_AUDIENCES = [
  'Créateurs & porteurs de projet',
  'Influenceurs & créateurs de contenu',
  'Revendeurs & micro-business digitaux',
  'Grossistes & partenaires stratégiques',
  'Hôtels, spas & établissements bien-être',
];

export const NEXERA_UNIVERS = [
  {
    id: 'skincare',
    label: 'Skincare',
    desc: 'Soins dermo-efficaces, actifs naturels, montée en gamme progressive.',
    products: ['Crème peau grasse', 'Crème peau sèche', 'Sérum visage', 'Gel nettoyant', 'Masque soin', 'Huile démaquillante'],
    configurator: false,
  },
  {
    id: 'capillaire',
    label: 'Capillaire',
    desc: 'Shampoings, masques et soins ciblés kératine, hydratation, pousse.',
    products: ['Shampoing Kératine', 'Shampoing Hydratation', 'Masque soin', 'Huile cheveux', 'Sérum cheveux', 'Masque pousse'],
    configurator: false,
  },
  {
    id: 'parfumerie',
    label: 'Parfumerie',
    desc: 'Fragrance & expérience olfactive — parfums, brumes, senteurs d\'ambiance.',
    products: ['Parfum', 'Brume', 'Lait parfumé', 'Huile senteur', 'Bougie', 'Bâtonnets parfumés', 'Parfums d\'intérieur', 'Senteur voiture'],
    configurator: true,
  },
];

export const NEXERA_PACKS = [
  {
    id: 'starter',
    name: 'Pack Starter',
    subtitle: 'Lancement simplifié, autonomie accompagnée',
    objective: 'Marques en lancement souhaitant avancer à leur rythme avec un soutien structurant.',
    highlights: [
      'Catalogue ACL : plastique & acrylique (verre en option)',
      'Impression basique : N&B ou couleurs simples',
      'Goodies de lancement (cartes, stickers, boxes, tote bags)',
      'Remise réassort : 10 %',
    ],
  },
  {
    id: 'builder',
    name: 'Pack Builder',
    subtitle: 'Structuration et élan commercial',
    objective: 'Marques ayant validé leur lancement et souhaitant se structurer davantage.',
    highlights: [
      'Tout Starter + ACL élargi (verre tarif réduit)',
      'Impression couleurs, papiers mat/brillant, étiquettes opaques/transparentes',
      'Goodies croissance — jusqu\'à 6 références',
      'Remise réassort : 20 %',
    ],
  },
  {
    id: 'leader',
    name: 'Pack Leader',
    subtitle: 'Accompagnement sur mesure, vision long terme',
    objective: 'Marques ambitieuses en quête d\'un accompagnement expert et continu.',
    highlights: [
      'ACL complet — verre inclus sans surcoût',
      'Finitions premium : dorure, argenté, holographique, embossage',
      'Goodies premium — jusqu\'à 8 références',
      'Remise réassort : 30 %',
    ],
  },
  {
    id: 'elite',
    name: 'Pack Elite',
    subtitle: 'Production de masse, accès illimité',
    objective: 'Clients à très fort volume — prix le plus bas garanti.',
    highlights: [
      'Pas d\'abonnement requis — seuil de commande minimal',
      'Accès illimité catalogue ACL, PLV & goodies',
      'Miniatures, kits, bundles, pop-up stores sur demande',
      'Accès intégral à l\'écosystème NEXERA',
    ],
  },
];

export const NEXERA_GOODIES = [
  'Box branding personnalisées',
  'Tote bags premium',
  'Papier de soie personnalisé',
  'Trousses brandées',
  'Étiquettes adhésives sur mesure',
  'Cartes de remerciement / inserts packaging',
  'Stickers & supports de communication',
];

export const findPack = (id) => NEXERA_PACKS.find((p) => p.id === id) ?? null;
