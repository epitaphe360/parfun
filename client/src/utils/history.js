import { subscribe } from 'valtio';
import state from '../store';

const TRACKED_KEYS = [
  'color', 'liquidColor', 'capColor', 'capType', 'capFinish',
  'bottleType', 'bottleSource', 'liquidLevel', 'environment', 'bgMode',
  'showCap', 'capOpen', 'bottleShine', 'autoRotate',
  'showEngraving', 'engravingText', 'engravingFont', 'engravingColor',
  'isLogoTexture', 'isFullTexture', 'logoDecal', 'fullDecal',
  'fragranceName', 'volumeMl', 'showFragranceLabel',
  'logoSize', 'fragranceLabelSize', 'engravingSize',
];

const MAX = 30;
const past = [];
const future = [];
let applying = false;
let debounce = null;

const snap = () => {
  const s = {};
  TRACKED_KEYS.forEach((k) => { s[k] = state[k]; });
  return s;
};

const apply = (s) => {
  applying = true;
  TRACKED_KEYS.forEach((k) => { if (s[k] !== undefined) state[k] = s[k]; });
  setTimeout(() => { applying = false; }, 50);
};

let last = snap();

subscribe(state, () => {
  if (applying) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const current = snap();
    if (TRACKED_KEYS.every((k) => current[k] === last[k])) return;
    past.push({ ...last });
    if (past.length > MAX) past.shift();
    future.length = 0;
    last = current;
  }, 400);
});

export const undo = () => {
  if (!past.length) return false;
  future.unshift({ ...last });
  const prev = past.pop();
  apply(prev);
  last = snap();
  return true;
};

export const redo = () => {
  if (!future.length) return false;
  past.push({ ...last });
  const next = future.shift();
  apply(next);
  last = snap();
  return true;
};

export const canUndo = () => past.length > 0;
export const canRedo = () => future.length > 0;
