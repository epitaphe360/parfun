import React, { useState, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';
import { exportSceneToGlb } from '../utils/exportGlb';
import { bottleGroupRef } from '../utils/sceneRef';

const Spinner = () => (
  <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
);

// Uses imperative DOM to avoid React warnings on custom element attributes
const ModelViewerMount = ({ src }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const mv = document.createElement('model-viewer');
    mv.src = src;
    mv.setAttribute('ar', '');
    mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('shadow-intensity', '1');
    mv.style.cssText = 'width:100%;height:300px;border-radius:12px;';
    containerRef.current.appendChild(mv);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ''; };
  }, [src]);
  return <div ref={containerRef} className="w-full" />;
};

const ArModal = ({ glbUrl, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    <div
      className="relative glassmorphism rounded-2xl p-4 flex flex-col items-center gap-3 shadow-2xl w-[90vw] max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Aperçu AR</p>
      <ModelViewerMount src={glbUrl} />
      <p className="text-[10px] text-gray-400 text-center">
        Sur mobile : appuyez sur le bouton AR pour placer votre flacon dans la réalité.
      </p>
      <button type="button" onClick={onClose} className="text-xs text-gray-400 underline">
        Fermer
      </button>
    </div>
  </div>
);

const AnimationPicker = () => {
  const snap = useSnapshot(state);
  const [exportingAr, setExportingAr] = useState(false);
  const [arUrl, setArUrl] = useState(null);

  const handleArPreview = async () => {
    if (!bottleGroupRef.current || exportingAr) return;
    setExportingAr(true);
    try {
      const url = await exportSceneToGlb(bottleGroupRef.current);
      setArUrl(url);
    } catch (_) {
      // Export failed — model too complex or non-serializable
    } finally {
      setExportingAr(false);
    }
  };

  return (
    <>
      <div className="picker-panel w-[240px]">
        <p className="picker-title">Animations</p>

        {/* Auto-rotate */}
        <p className="picker-subtitle mb-1">Rotation</p>
        <button
          type="button"
          onClick={() => { state.autoRotate = !snap.autoRotate; }}
          className={`picker-chip w-full mb-3 py-2 text-sm font-medium ${snap.autoRotate ? 'active' : ''}`}
        >
          {snap.autoRotate ? '⏹  Arrêter la rotation' : '▶  Rotation automatique'}
        </button>

        {/* Cap open/close */}
        <p className="picker-subtitle mb-1">Bouchon</p>
        <button
          type="button"
          onClick={() => { state.capOpen = !snap.capOpen; }}
          className={`picker-chip w-full mb-3 py-2 text-sm font-medium ${snap.capOpen ? 'active' : ''}`}
        >
          {snap.capOpen ? '🔓  Bouchon ouvert — cliquer pour fermer' : '🔒  Ouvrir le bouchon'}
        </button>

        {/* Spray */}
        <p className="picker-subtitle mb-1">Pulvérisateur</p>
        <button
          type="button"
          onClick={() => { if (!snap.sprayActive) state.sprayActive = true; }}
          className={`picker-chip w-full mb-3 py-2 text-sm font-medium ${snap.sprayActive ? 'opacity-50 cursor-wait' : ''}`}
          disabled={snap.sprayActive}
        >
          {snap.sprayActive ? '💨  Pulvérisation en cours…' : '💨  Pulvériser'}
        </button>

        {/* AR Preview */}
        <p className="picker-subtitle mb-1">Réalité augmentée</p>
        <button
          type="button"
          onClick={handleArPreview}
          disabled={exportingAr}
          className="picker-chip w-full py-2 text-sm font-medium"
        >
          {exportingAr ? <><Spinner />Préparation…</> : '📱  Aperçu AR (mobile)'}
        </button>

        <div className="divider mt-3" />

        <div className="text-[10px] text-gray-400 leading-relaxed space-y-1">
          <p>🌊 Surface liquide s'incline en temps réel — inertie réaliste.</p>
          <p>✨ Iridescence ajustable dans l'onglet Ambiance.</p>
        </div>
      </div>

      {arUrl && <ArModal glbUrl={arUrl} onClose={() => { setArUrl(null); URL.revokeObjectURL(arUrl); }} />}
    </>
  );
};

export default AnimationPicker;
