import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

import {
  AnimationPicker,
  BottlePicker,
  CapPicker,
  ColorPicker,
  CustomButton,
  EngravingPicker,
  EnvironmentPicker,
  ExportButton,
  FilePicker,
  FragrancePicker,
  FragranceQuiz,
  LiquidLevelSlider,
  PhotoToGlbPicker,
  PresetPicker,
  ShareButton,
} from '../components';
import { reader } from '../config/helpers';
import { fadeAnimation, slideAnimation } from '../config/motion';
import state from '../store';
import { loadFromUrl, loadConfig, applyConfigRules } from '../utils/configStorage';
import { undo, redo } from '../utils/history';
import { isRealImage } from '../canvas/bottles/BottleLabel';

// Detects whether a decal slot holds a real user image (not the empty placeholder)
const isRealDecal = (data) => isRealImage(data) && data.length > 200;

const SECTIONS = [
  { id: 'flacon',    label: 'Flacon' },
  { id: 'jus',       label: 'Jus' },
  { id: 'bouchon',   label: 'Bouchon' },
  { id: 'etiquette', label: 'Étiquette' },
  { id: 'gravure',   label: 'Gravure' },
  { id: 'fragrance', label: 'Nom & Vol.' },
  { id: 'ambiance',  label: 'Ambiance' },
  { id: 'animation', label: 'Animation' },
  { id: 'import3d',  label: 'Import 3D' },
  { id: 'presets',   label: 'Presets' },
  { id: 'quiz',      label: 'Quiz' },
];

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [activeSection, setActiveSection] = useState('flacon');

  // Load saved / URL configuration on first mount
  useEffect(() => {
    if (!loadFromUrl(state)) {
      loadConfig(state);
    } else {
      applyConfigRules(state);
    }
  }, []);

  // Keyboard shortcuts: Ctrl+Z undo, Ctrl+Y / Ctrl+Shift+Z redo
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, []);

  // ── File / decal handling ──────────────────────────────────────────────
  const handleDecals = (type, result) => {
    if (type === 'logo') {
      state.logoDecal = result;
      state.isLogoTexture = true;
    } else {
      state.fullDecal = result;
      state.isFullTexture = true;
    }
  };

  const readFile = (type) => {
    if (!file) return;
    reader(file).then((result) => {
      handleDecals(type, result);
      setFile('');
    });
  };

  const toggleTexture = (type) => {
    if (type === 'logo') state.isLogoTexture = !snap.isLogoTexture;
    if (type === 'full') state.isFullTexture = !snap.isFullTexture;
  };

  // ── Section renderer ───────────────────────────────────────────────────
  const renderSectionPanel = () => {
    switch (activeSection) {
      case 'flacon':
        return (
          <>
            <BottlePicker />
            <ColorPicker target="bottle" />
          </>
        );
      case 'jus':
        return (
          <>
            <ColorPicker target="liquid" />
            <LiquidLevelSlider />
          </>
        );
      case 'bouchon':
        return <CapPicker />;
      case 'etiquette':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case 'gravure':
        return <EngravingPicker />;
      case 'fragrance':
        return <FragrancePicker />;
      case 'ambiance':
        return <EnvironmentPicker />;
      case 'animation':
        return <AnimationPicker />;
      case 'import3d':
        return <PhotoToGlbPicker />;
      case 'presets':
        return <PresetPicker />;
      case 'quiz':
        return <FragranceQuiz />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* ── Left panel ───────────────────────────────────────────── */}
          <motion.div
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="structured-panel">
              {/* Sections column */}
              <div className="sections-column">
                <h3 className="sections-title">Configuration</h3>

                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
                  >
                    {section.label}
                  </button>
                ))}

                <div className="divider" />

                {/* Quick-toggle texture visibility */}
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Visibilité
                </p>
                {(() => {
                  const hasLogo = isRealDecal(snap.logoDecal);
                  const hasFull = isRealDecal(snap.fullDecal);
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleTexture('logo')}
                        disabled={!hasLogo}
                        title={hasLogo ? '' : 'Importez d\'abord une image dans Étiquette'}
                        className={`section-btn compact ${snap.isLogoTexture && hasLogo ? 'active' : ''} ${!hasLogo ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Étiquette logo
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTexture('full')}
                        disabled={!hasFull}
                        title={hasFull ? '' : 'Importez d\'abord une image dans Étiquette'}
                        className={`section-btn compact ${snap.isFullTexture && hasFull ? 'active' : ''} ${!hasFull ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Habillage complet
                      </button>
                    </>
                  );
                })()}

                <div className="divider" />

                <p className="text-[10px] text-gray-500 leading-relaxed">
                  ↺ Tourner en 360° | ⊕ Molette pour zoomer
                </p>
              </div>

              {/* Editor column */}
              <div className="editor-column">
                <div className="editor-header">
                  <span className="editor-title">
                    {SECTIONS.find((s) => s.id === activeSection)?.label}
                  </span>
                </div>
                <div className="editor-content">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      {renderSectionPanel()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Top-right toolbar ─────────────────────────────────────── */}
          <motion.div
            className="absolute z-10 top-5 right-5 flex gap-2 items-center"
            {...fadeAnimation}
          >
            {/* Undo / Redo */}
            <button
              type="button"
              onClick={undo}
              className="export-btn text-sm"
              title="Annuler (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              type="button"
              onClick={redo}
              className="export-btn text-sm"
              title="Rétablir (Ctrl+Y)"
            >
              ↪
            </button>

            <ShareButton />
            <ExportButton />
            <CustomButton
              type="filled"
              title="Accueil"
              handleClick={() => { state.intro = true; }}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
