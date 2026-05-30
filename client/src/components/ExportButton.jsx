import React, { useState } from 'react';
import { exportSceneToGlb } from '../utils/exportGlb';
import { bottleGroupRef } from '../utils/sceneRef';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const Spinner = () => (
  <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

const ExportButton = () => {
  const [exportingPng, setExportingPng] = useState(false);
  const [exportingGlb, setExportingGlb] = useState(false);
  const [toast, setToast] = useState(null); // { msg, kind: 'ok' | 'err' }

  const flash = (msg, kind = 'ok') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2400);
  };

  const handleExportPng = () => {
    if (exportingPng) return;
    setExportingPng(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const canvas = document.querySelector('canvas');
          if (!canvas) throw new Error('Aucun canvas trouvé.');
          const link = document.createElement('a');
          const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
          link.download = `parfun-${ts}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          flash('PNG téléchargé');
        } catch (e) {
          flash(`PNG impossible : ${e.message || 'erreur'}`, 'err');
        } finally {
          setTimeout(() => setExportingPng(false), 400);
        }
      });
    });
  };

  const handleExportGlb = async () => {
    if (exportingGlb) return;
    if (!bottleGroupRef.current) {
      flash('Modèle pas prêt, réessaie dans 1s.', 'err');
      return;
    }
    setExportingGlb(true);
    try {
      const url = await exportSceneToGlb(bottleGroupRef.current);
      const link = document.createElement('a');
      const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      link.download = `parfun-${ts}.glb`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      flash('GLB téléchargé');
    } catch (e) {
      flash(`GLB impossible : ${e.message || 'erreur'}`, 'err');
    } finally {
      setExportingGlb(false);
    }
  };

  return (
    <div className="flex gap-1.5 relative">
      <button
        type="button"
        onClick={handleExportPng}
        className="export-btn"
        title="Télécharger image PNG"
        disabled={exportingPng}
      >
        {exportingPng ? <Spinner /> : <DownloadIcon />}
      </button>

      <button
        type="button"
        onClick={handleExportGlb}
        className="export-btn text-[10px] font-bold tracking-wide"
        title="Télécharger modèle 3D GLB"
        disabled={exportingGlb}
      >
        {exportingGlb ? <Spinner /> : 'GLB'}
      </button>

      {toast && (
        <div
          className={`absolute top-full mt-1 right-0 text-[11px] px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-50 ${
            toast.kind === 'err' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
