// Keys safe to put in a URL (no large base64 blobs)
const URL_KEYS = [
  'color', 'liquidColor', 'capColor', 'capType', 'capFinish',
  'bottleType', 'bottleSource', 'liquidLevel', 'environment', 'bgMode',
  'showCap', 'bottleShine',
  'showEngraving', 'engravingText', 'engravingFont', 'engravingColor',
  'isLogoTexture', 'isFullTexture',
  'fragranceName', 'volumeMl', 'showFragranceLabel',
  'logoSize', 'fragranceLabelSize', 'engravingSize',
];

const LS_KEYS = [...URL_KEYS, 'logoDecal', 'fullDecal'];

const LS_KEY = 'parfun_config_v3';

/** Keep cap/bottle mode consistent after load or preset apply. */
export const applyConfigRules = (stateProxy) => {
  if (stateProxy.bottleSource === 'procedural') {
    stateProxy.showCap = true;
  } else if (!stateProxy.useCustomGlb) {
    stateProxy.showCap = false;
  }
  stateProxy.capOpen = false;
  stateProxy.sprayActive = false;
  if (stateProxy.fragranceName == null || String(stateProxy.fragranceName).trim() === '') {
    stateProxy.fragranceName = 'Mon parfum';
  }
};

export const saveConfig = (stateProxy) => {
  const cfg = {};
  LS_KEYS.forEach((k) => { cfg[k] = stateProxy[k]; });
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch (_) {}
};

export const loadConfig = (stateProxy) => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const cfg = JSON.parse(raw);
    LS_KEYS.forEach((k) => {
      if (cfg[k] === undefined || cfg[k] === null) return;
      if (k === 'fragranceName' && String(cfg[k]).trim() === '') return;
      stateProxy[k] = cfg[k];
    });
    applyConfigRules(stateProxy);
    return true;
  } catch (_) {
    return false;
  }
};

export const getShareUrl = (stateProxy) => {
  const cfg = {};
  URL_KEYS.forEach((k) => { cfg[k] = stateProxy[k]; });
  try {
    const encoded = btoa(encodeURIComponent(JSON.stringify(cfg)));
    const url = new URL(window.location.href);
    url.searchParams.set('cfg', encoded);
    return url.toString();
  } catch (_) {
    return window.location.href;
  }
};

export const loadFromUrl = (stateProxy) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('cfg');
    if (!encoded) return false;
    const cfg = JSON.parse(decodeURIComponent(atob(encoded)));
    URL_KEYS.forEach((k) => {
      if (cfg[k] !== undefined && cfg[k] !== null) stateProxy[k] = cfg[k];
    });
    applyConfigRules(stateProxy);
    return true;
  } catch (_) {
    return false;
  }
};
