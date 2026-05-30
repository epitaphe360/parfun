import React, { useState } from 'react';
import state from '../store';
import { saveConfig, getShareUrl } from '../utils/configStorage';

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const QrIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <line x1="14" y1="14" x2="14" y2="14" /><line x1="17" y1="14" x2="20" y2="14" />
    <line x1="14" y1="17" x2="14" y2="20" /><line x1="17" y1="17" x2="20" y2="20" />
    <line x1="20" y1="17" x2="20" y2="20" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const QrModal = ({ url, onClose }) => {
  const encoded = encodeURIComponent(url);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encoded}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative glassmorphism rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Partager</p>
        <img
          src={qrSrc}
          alt="QR Code de partage"
          width={160}
          height={160}
          className="rounded-lg border border-white/40"
        />
        <p className="text-[10px] text-gray-500 text-center max-w-[160px] leading-relaxed">
          Scannez pour ouvrir cette configuration sur un autre appareil.
        </p>
        <input
          readOnly
          value={url}
          className="w-full text-[9px] p-1.5 rounded bg-white/60 border border-white/30 text-gray-500 truncate outline-none"
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 mt-1"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

const ShareButton = () => {
  const [savedFlash, setSavedFlash] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);

  const handleSave = () => {
    saveConfig(state);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleShare = () => {
    const url = getShareUrl(state);
    setQrUrl(url);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="export-btn"
          title={savedFlash ? 'Configuration sauvegardée !' : 'Sauvegarder la configuration'}
        >
          {savedFlash ? <CheckIcon /> : <SaveIcon />}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="export-btn"
          title="Partager via QR Code"
        >
          <QrIcon />
        </button>
      </div>

      {qrUrl && <QrModal url={qrUrl} onClose={() => setQrUrl(null)} />}
    </>
  );
};

export default ShareButton;
