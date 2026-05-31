import { Canvas } from '@react-three/fiber';
import { Suspense, Component, useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import PerfumeScene from './PerfumeScene';
import CameraRig from './CameraRig';
import StudioLighting from './scene/StudioLighting';
import PostProcessing from './scene/PostProcessing';
import CameraControls from './scene/CameraControls';

const LoadingOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-20">
    <div className="w-10 h-10 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin" />
    <p className="text-xs text-gray-400 tracking-widest uppercase font-light">Chargement…</p>
  </div>
);

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }

  static getDerivedStateFromError(e) { return { error: e }; }

  componentDidCatch(error) {
    state.importStatus = 'error';
    state.importError = error?.message || 'Erreur de chargement 3D';
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="glassmorphism rounded-xl p-6 text-center max-w-xs">
            <p className="text-sm text-red-500 mb-2">Erreur de chargement 3D</p>
            <p className="text-xs text-gray-500 mb-3">
              {this.state.error?.message || 'Fichier GLB invalide ou corrompu.'}
            </p>
            <button
              type="button"
              className="text-xs underline text-gray-600"
              onClick={() => {
                this.setState({ error: null });
                state.importStatus = 'idle';
                state.importError = '';
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const CanvasModel = () => {
  const [ready, setReady] = useState(false);
  const snap = useSnapshot(state);

  const camera = snap.intro
    ? { position: [0.15, 0.78, 2.65], fov: 28 }
    : { position: [0.2, 0.82, 2.35], fov: 30 };

  return (
    <div className="relative w-full h-full">
      {!ready && <LoadingOverlay />}
      <SceneErrorBoundary>
        <Canvas
          shadows
          camera={camera}
          gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
          className="w-full max-w-full h-full transition-all ease-in"
          dpr={[1, 2]}
          onCreated={() => setTimeout(() => setReady(true), 900)}
        >
          <Suspense fallback={null}>
            <StudioLighting />
            <CameraControls />
            <CameraRig>
              <PerfumeScene />
            </CameraRig>
            <PostProcessing />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};

export default CanvasModel;
