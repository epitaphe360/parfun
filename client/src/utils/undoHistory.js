import { subscribe } from 'valtio';
import state from '../store';

const TRACKED = [
  'color', 'liquidColor', 'capColor', 'capType', 'capFinish',
  'bottleType', 'bottleSource', 'liquidLevel', 'bottleShine',
  'environment', 'bgMode', 'showCap', 'capOpen',
  'isLogoTexture', 'isFullTexture', 'logoDecal', 'fullDecal',
  'showEngraving', 'engravingText', 'engravingFont', 'engravingColor',
  'fragranceName', 'volumeMl',
];

const MAX = 25;
const stack = [];
let cursor = -1;
let restoring = false;
let debounceTimer = null;

const capture = () => {
  if (restoring) return;
  const snap = {};
  TRACKED.forEach((k) => { snap[k] = state[k]; });
  // Truncate any forward history
  stack.splice(cursor + 1);
  stack.push(snap);
  if (stack.length > MAX) stack.shift();
  cursor = stack.length - 1;
};

export const initUndoHistory = () => {
  capture(); // baseline snapshot
  return subscribe(state, () => {
    if (restoring) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(capture, 350);
  });
};

const restore = (snap) => {
  restoring = true;
  TRACKED.forEach((k) => {
    if (snap[k] !== undefined) state[k] = snap[k];
  });
  restoring = false;
};

export const undo = () => {
  if (cursor <= 0) return;
  cursor -= 1;
  restore(stack[cursor]);
};

export const redo = () => {
  if (cursor >= stack.length - 1) return;
  cursor += 1;
  restore(stack[cursor]);
};

export const canUndo = () => cursor > 0;
export const canRedo = () => cursor < stack.length - 1;
