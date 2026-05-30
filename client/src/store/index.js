import { proxy } from 'valtio';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const state = proxy({
  intro: true,

  // --- Bottle ---
  color: '#F4EDE4',
  bottleType: 'elegant',
  bottleSource: 'glb',
  bottleShine: 0.35,       // iridescence strength 0–1

  // --- Liquid ---
  liquidColor: '#7E1F3A',
  liquidLevel: 0.68,

  // --- Cap ---
  capColor: '#D4AF37',
  capType: 'classic',
  capFinish: 'gold',
  showCap: false,           // GLB has native cap by default — toggle on for procedural
  capOpen: false,

  // --- Labels ---
  isLogoTexture: false,
  isFullTexture: false,
  logoDecal: TRANSPARENT_PIXEL,
  fullDecal: TRANSPARENT_PIXEL,

  // --- Engraving ---
  showEngraving: false,
  engravingText: 'MON PARFUM',
  engravingFont: 'serif',   // 'serif' | 'sans'
  engravingColor: '#D4AF37',
  engravingSize: 1,         // 0.4–2 multiplier on width / height / arc

  // --- Fragrance label (printed name + volume) ---
  showFragranceLabel: false,
  fragranceLabelSize: 1,    // 0.4–2 multiplier

  // --- Logo label ---
  logoSize: 1,              // 0.4–2 multiplier

  // --- Environment & background ---
  environment: 'studio',    // maps to drei Environment preset
  bgMode: 'warm',           // 'warm' | 'white' | 'dark' | 'midnight'

  // --- Import ---
  customGlbUrl: null,
  useCustomGlb: false,
  importStatus: 'idle',
  importError: '',

  // --- Spray animation ---
  sprayActive: false,

  // --- Camera ---
  autoRotate: false,

  // --- Misc ---
  preset: null,
  fragranceName: 'Mon parfum',
  volumeMl: 50,
  bottleMetrics: {
    height: 1.2,
    topY: 1.2,
    bottomY: 0,
    centerY: 0.6,
    liquidRadius: 0.16,
    capY: 1.28,
    // Liquid-specific bounds — exclude the cap area on GLB models
    liquidTopY: 0.88,
    liquidBottomY: 0,
    hasNativeCap: true,
  },
});

export default state;
