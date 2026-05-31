import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CatalogUnivers } from '../components';
import { NEXERA, NEXERA_PACKS } from '../config/nexera';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home home-nexera" {...slideAnimation('left')}>
          <motion.header {...slideAnimation('down')} className="home-header">
            <span className="brand-mark">{NEXERA.name}</span>
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation} className="home-hero">
              <h1 className="head-text head-text-nexera">
                MARQUE <br className="hidden lg:block" /> COSMÉTIQUE.
              </h1>
              <p className="home-tagline">
                {NEXERA.tagline}. De l&apos;idée à la mise sur le marché —
                <strong> configurateur 3D parfumerie</strong>, catalogue ACL et accompagnement 360°.
              </p>
            </motion.div>

            <motion.div {...headContentAnimation} className="home-panel">
              <CatalogUnivers onStartConfigurator={() => { state.intro = false; }} />

              <div className="home-packs-preview">
                <p className="home-packs-label">Nos packs</p>
                <div className="home-packs-row">
                  {NEXERA_PACKS.map((p) => (
                    <span key={p.id} className="home-pack-chip">
                      {p.name.replace('Pack ', '')}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
