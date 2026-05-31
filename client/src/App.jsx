import { useSnapshot } from 'valtio';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  return (
    <main className={`app transition-all ease-in ${snap.intro ? 'app--home' : 'app--configurator'}`}>
      <Home />
      <div className="canvas-stage">
        {snap.intro && (
          <p className="home-canvas-hint">Aperçu 3D — faites pivoter le flacon</p>
        )}
        <Canvas />
      </div>
      <Customizer />
    </main>
  );
}

export default App;
