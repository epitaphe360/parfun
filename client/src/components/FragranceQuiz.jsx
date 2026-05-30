import React, { useState } from 'react';
import state from '../store';
import { PRESETS } from '../config/presets';
import { applyConfigRules } from '../utils/configStorage';

const FULL_KEYS = [
  'color', 'liquidColor', 'capColor', 'capType', 'capFinish',
  'bottleType', 'bottleSource', 'environment', 'bgMode',
  'liquidLevel', 'bottleShine', 'fragranceName', 'volumeMl',
  'showFragranceLabel',
  'showEngraving', 'engravingText', 'engravingFont', 'engravingColor',
];

const STEPS = [
  {
    id: 'famille',
    question: 'Quelle famille olfactive vous attire ?',
    options: [
      { id: 'florale',  label: 'Florale',   icon: '🌸' },
      { id: 'boisee',   label: 'Boisée',    icon: '🌲' },
      { id: 'epicee',   label: 'Épicée',    icon: '🌶' },
      { id: 'marine',   label: 'Marine',    icon: '🌊' },
    ],
  },
  {
    id: 'intensite',
    question: 'Quelle intensité recherchez-vous ?',
    options: [
      { id: 'fraiche',  label: 'Fraîche & légère',  icon: '💨' },
      { id: 'chaude',   label: 'Chaude & sensuelle', icon: '🕯' },
      { id: 'intense',  label: 'Intense & audacieuse', icon: '⚡' },
    ],
  },
  {
    id: 'style',
    question: 'Quel style vous correspond ?',
    options: [
      { id: 'minimal',  label: 'Minimaliste',  icon: '◻' },
      { id: 'classique', label: 'Classique',   icon: '👑' },
      { id: 'luxueux',  label: 'Luxueux',      icon: '✨' },
      { id: 'avant',    label: 'Avant-garde',  icon: '🔮' },
    ],
  },
];

// Recommendation matrix: [famille][intensite] → presetId
const MATRIX = {
  florale:  { fraiche: 'minimal', chaude: 'rose',  intense: 'or'    },
  boisee:   { fraiche: 'ocean',   chaude: 'amber', intense: 'or'    },
  epicee:   { fraiche: 'ocean',   chaude: 'amber', intense: 'noir'  },
  marine:   { fraiche: 'ocean',   chaude: 'ocean', intense: 'minimal'},
};

// Style modifier — can override if very strong match
const STYLE_OVERRIDE = {
  minimal: 'minimal',
  avant: 'noir',
};

const getRecommendation = (answers) => {
  const { famille, intensite, style } = answers;
  if (STYLE_OVERRIDE[style]) {
    return STYLE_OVERRIDE[style];
  }
  return MATRIX[famille]?.[intensite] ?? 'or';
};

const FragranceQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const currentStep = STEPS[step];

  const handleChoice = (optId) => {
    const newAnswers = { ...answers, [currentStep.id]: optId };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const presetId = getRecommendation(newAnswers);
      const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
      setResult(preset);
    }
  };

  const applyPreset = (preset) => {
    state.preset = preset.id;
    FULL_KEYS.forEach((k) => { if (preset[k] !== undefined) state[k] = preset[k]; });
    state.showFragranceLabel = true;
    state.useCustomGlb = false;
    state.bottleSource = preset.bottleSource ?? 'glb';
    applyConfigRules(state);
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="picker-panel w-[240px]">
        <p className="picker-title">Votre fragrance idéale</p>

        <div className="text-center py-3">
          <div className="flex justify-center gap-1 mb-2">
            <span className="preset-swatch w-6 h-6" style={{ background: result.color }} />
            <span className="preset-swatch w-6 h-6" style={{ background: result.liquidColor }} />
            <span className="preset-swatch w-6 h-6" style={{ background: result.capColor }} />
          </div>
          <p className="text-base font-bold text-[#1A1A1A] mb-1">{result.name}</p>
          <p className="text-[10px] text-gray-500 mb-4">
            Basé sur vos préférences olfactives
          </p>

          <button
            type="button"
            onClick={() => applyPreset(result)}
            className="picker-chip active w-full py-2 text-sm font-bold mb-2"
          >
            Appliquer ce style
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-gray-400 underline"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="picker-panel w-[240px]">
      <div className="flex items-center justify-between mb-3">
        <p className="picker-title">Quiz Fragrance</p>
        <span className="text-[10px] text-gray-400">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="progress-bar mb-4">
        <div
          className="progress-fill"
          style={{ width: `${((step) / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }}
        />
      </div>

      <p className="text-xs font-semibold text-[#1A1A1A] mb-3 leading-snug">
        {currentStep.question}
      </p>

      <div className="flex flex-col gap-1.5">
        {currentStep.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleChoice(opt.id)}
            className="picker-option flex items-center gap-2 text-left py-2"
          >
            <span className="text-lg leading-none">{opt.icon}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-3 text-[10px] text-gray-400 underline"
        >
          ← Retour
        </button>
      )}
    </div>
  );
};

export default FragranceQuiz;
