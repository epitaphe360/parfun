import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

import {
  AnimationPicker,
  BottleCatalog,
  CapCatalog,
  ColorPicker,
  ContactForm,
  CustomButton,
  DesignStep,
  EngravingPicker,
  EnvironmentPicker,
  ExportButton,
  FragranceQuiz,
  InfoPanel,
  OffersPanel,
  CatalogUnivers,
  LiquidLevelSlider,
  PhotoToGlbPicker,
  PresetPicker,
  PumpCatalog,
  ResetModal,
  SelectionSummary,
  ShareButton,
} from '../components';
import { fadeAnimation, slideAnimation } from '../config/motion';
import state from '../store';
import { loadFromUrl, loadConfig, applyConfigRules, resetToDefaults } from '../utils/configStorage';
import { undo, redo } from '../utils/history';
import { printSummaryPdf } from '../utils/printSummary';
import { isRealImage } from '../canvas/bottles/BottleLabel';

const isRealDecal = (data) => isRealImage(data) && data.length > 200;

const MAIN_STEPS = [
  { id: 'info', label: 'NEXERA' },
  { id: 'offres', label: 'Offres' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'bottle', label: 'Flacon' },
  { id: 'pump', label: 'Pompes' },
  { id: 'cap', label: 'Bouchons' },
  { id: 'design', label: 'Design' },
];

const ADVANCED_STEPS = [
  { id: 'jus', label: 'Jus' },
  { id: 'gravure', label: 'Gravure' },
  { id: 'ambiance', label: 'Ambiance' },
  { id: 'animation', label: 'Animation' },
  { id: 'import3d', label: 'Import 3D' },
  { id: 'presets', label: 'Presets' },
  { id: 'quiz', label: 'Quiz' },
];

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeSection, setActiveSection] = useState('bottle');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

  useEffect(() => {
    if (!loadFromUrl(state)) {
      loadConfig(state);
    } else {
      applyConfigRules(state);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('summary-open', showSummary);
    return () => document.body.classList.remove('summary-open');
  }, [showSummary]);

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

  const toggleTexture = (type) => {
    if (type === 'logo') state.isLogoTexture = !snap.isLogoTexture;
    if (type === 'full') state.isFullTexture = !snap.isFullTexture;
  };

  const renderSectionPanel = () => {
    switch (activeSection) {
      case 'info':
        return <InfoPanel />;
      case 'offres':
        return <OffersPanel />;
      case 'catalogue':
        return <CatalogUnivers />;
      case 'bottle':
        return (
          <>
            <BottleCatalog />
            <ColorPicker target="bottle" />
          </>
        );
      case 'pump':
        return <PumpCatalog />;
      case 'cap':
        return <CapCatalog />;
      case 'design':
        return <DesignStep />;
      case 'jus':
        return (
          <>
            <ColorPicker target="liquid" />
            <LiquidLevelSlider />
          </>
        );
      case 'gravure':
        return <EngravingPicker />;
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

  const allSteps = [...MAIN_STEPS, ...(showAdvanced ? ADVANCED_STEPS : [])];
  const sectionLabel = allSteps.find((s) => s.id === activeSection)?.label ?? 'Configuration';

  const handleReset = () => {
    resetToDefaults(state);
    setShowReset(false);
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="structured-panel erbatur">
              <div className="sections-column">
                <h3 className="sections-title">Sélections</h3>

                {MAIN_STEPS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
                  >
                    {section.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="section-btn compact mt-1 opacity-70"
                >
                  {showAdvanced ? '▾ Options avancées' : '▸ Options avancées'}
                </button>

                {showAdvanced && ADVANCED_STEPS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`section-btn compact ${activeSection === section.id ? 'active' : ''}`}
                  >
                    {section.label}
                  </button>
                ))}

                <div className="divider" />

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
                        className={`section-btn compact ${snap.isLogoTexture && hasLogo ? 'active' : ''} ${!hasLogo ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTexture('full')}
                        disabled={!hasFull}
                        className={`section-btn compact ${snap.isFullTexture && hasFull ? 'active' : ''} ${!hasFull ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Habillage
                      </button>
                    </>
                  );
                })()}

                <div className="divider" />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  ↺ Tourner | ⊕ Zoomer
                </p>
              </div>

              <div className="editor-column">
                <div className="editor-header">
                  <span className="editor-title">{sectionLabel}</span>
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

          <button
            type="button"
            className="summary-desktop-toggle hidden lg:flex"
            onClick={() => setShowSummary((v) => !v)}
          >
            {showSummary ? '✕ Fermer' : '☰ Récap'}
          </button>

          {showSummary && (
          <motion.div
            className="summary-wrapper hidden lg:block"
            {...slideAnimation('right')}
          >
            {showContact ? (
              <ContactForm onClose={() => setShowContact(false)} />
            ) : (
              <SelectionSummary
                onContact={() => setShowContact(true)}
                onReset={() => setShowReset(true)}
                onPrint={() => printSummaryPdf(state)}
              />
            )}
          </motion.div>
          )}

          <button
            type="button"
            className="summary-mobile-toggle lg:hidden"
            onClick={() => setShowSummaryMobile((v) => !v)}
          >
            {showSummaryMobile ? '✕' : '☰ Récap'}
          </button>

          {showSummaryMobile && (
            <div className="summary-mobile lg:hidden">
              {showContact ? (
                <ContactForm onClose={() => setShowContact(false)} />
              ) : (
                <SelectionSummary
                  onContact={() => setShowContact(true)}
                  onReset={() => setShowReset(true)}
                  onPrint={() => printSummaryPdf(state)}
                />
              )}
            </div>
          )}

          <motion.div
            className="absolute z-10 top-5 right-5 flex gap-2 items-center toolbar-right"
            {...fadeAnimation}
          >
            <button type="button" onClick={undo} className="export-btn text-sm" title="Annuler">↩</button>
            <button type="button" onClick={redo} className="export-btn text-sm" title="Rétablir">↪</button>
            <ShareButton />
            <ExportButton />
            <CustomButton
              type="filled"
              title="Accueil"
              handleClick={() => { state.intro = true; }}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <ResetModal
            open={showReset}
            onCancel={() => setShowReset(false)}
            onConfirm={handleReset}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
