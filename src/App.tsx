// ══════════════════════════════════════════════════
// ONE WISH WILLOW — App Router & Layout
// 7 stages: Landing → Caesar → Memory → WordChain → StarConnect → WishCipher → Reveal
// ══════════════════════════════════════════════════

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useRef, useCallback, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { ParticleCanvas, type ParticleCanvasRef } from './components/ParticleCanvas';
import { ProgressBar } from './components/ProgressBar';
import { playTransitionWhoosh, startAmbient } from './lib/sfx';
import { Layout } from './components/Layout';

import Landing from './pages/Landing.tsx';
import CaesarCipher from './pages/CaesarCipher.tsx';
import MemoryMatch from './pages/MemoryMatch.tsx';
import WordChain from './pages/WordChain.tsx';
import StarConnect from './pages/StarConnect.tsx';
import WishCipher from './pages/WishCipher.tsx';
import WishReveal from './pages/WishReveal.tsx';

const LEVEL_ROUTES = ['/', '/cipher', '/memory', '/chain', '/stars', '/wish-machine', '/reveal'];

export default function App() {
  const { state, completeLevel, setWish, resetGame, isLevelUnlocked } = useGameState();
  const particlesRef = useRef<ParticleCanvasRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<'idle' | 'closing' | 'opening'>('idle');
  const [audioStarted, setAudioStarted] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioStarted) {
      startAmbient(0.03);
      setAudioStarted(true);
    }
  }, [audioStarted]);

  const goToLevel = useCallback((level: number) => {
    if (transitionState !== 'idle') return;
    setTransitionState('closing');
    playTransitionWhoosh();

    setTimeout(() => {
      navigate(LEVEL_ROUTES[level] || '/');
      setTransitionState('opening');
      setTimeout(() => setTransitionState('idle'), 550);
    }, 550);
  }, [navigate, transitionState]);

  const onLevelComplete = useCallback((level: number) => {
    completeLevel(level);
    if (level < LEVEL_ROUTES.length - 1) {
      setTimeout(() => goToLevel(level + 1), 200);
    }
  }, [completeLevel, goToLevel]);

  const showProgress = location.pathname !== '/';
  const currentLevelFromRoute = LEVEL_ROUTES.indexOf(location.pathname);

  const ps = particlesRef.current?.system ?? null;

  // Show audio gate on non-landing pages when audio hasn't been unlocked yet
  const needsAudioGate = !audioStarted && location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <ParticleCanvas ref={particlesRef} />

      {/* Magical CRT Transition */}
      {transitionState !== 'idle' && (
        <div className={`crt-overlay ${transitionState}`}>
          <div className="crt-screen" />
        </div>
      )}

      {/* Global Audio Unlock Gate */}
      {needsAudioGate && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
             style={{ backgroundColor: 'var(--oww-black-soft)' }}>
          <p className="font-mono text-xs tracking-[1em] mb-8 anim-flicker"
             style={{ color: 'var(--oww-gold)' }}>
            ✦ ✦ ✦
          </p>
          <p className="font-mono text-sm tracking-[0.15em] uppercase mb-4 anim-fade-in"
             style={{ color: 'var(--oww-cream-dark)' }}>
            THE WILLOW AWAITS YOUR PRESENCE
          </p>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase mb-12 anim-fade-in"
             style={{ color: 'var(--oww-brown-light)', opacity: 0.5, animationDelay: '0.5s' }}>
            SOUND IS RECOMMENDED
          </p>
          <button onClick={initAudio}
                  className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-4 border-2 transition-all cursor-pointer hover:bg-[var(--oww-gold)] hover:text-[var(--oww-black)] active:scale-95 anim-pulse-gold"
                  style={{ 
                    borderColor: 'var(--oww-gold)', 
                    color: 'var(--oww-gold)',
                    backgroundColor: 'transparent',
                  }}>
            ✦ TOUCH TO AWAKEN ✦
          </button>
        </div>
      )}

      {showProgress && (
        <ProgressBar 
          currentLevel={currentLevelFromRoute - 1} 
          completedLevels={state.completedLevels.map(c => c - 1).filter(c => c >= 0)} 
        />
      )}

      <Layout>
        <div className="w-full flex-1 flex flex-col h-full">
          <Routes>
            <Route path="/" element={
              <Landing 
                onStart={() => { initAudio(); onLevelComplete(0); }}
                initAudio={initAudio}
                particles={ps} 
              />
            } />
            <Route path="/cipher" element={
              isLevelUnlocked(1) 
                ? <CaesarCipher onComplete={() => onLevelComplete(1)} particles={ps} />
                : <Navigate to="/" replace />
            } />
            <Route path="/memory" element={
              isLevelUnlocked(2)
                ? <MemoryMatch onComplete={() => onLevelComplete(2)} particles={ps} />
                : <Navigate to="/" replace />
            } />
            <Route path="/chain" element={
              isLevelUnlocked(3)
                ? <WordChain onComplete={() => onLevelComplete(3)} particles={ps} />
                : <Navigate to="/" replace />
            } />
            <Route path="/stars" element={
              isLevelUnlocked(4)
                ? <StarConnect onComplete={() => onLevelComplete(4)} particles={ps} />
                : <Navigate to="/" replace />
            } />
            <Route path="/wish-machine" element={
              isLevelUnlocked(5)
                ? <WishCipher onComplete={(text, mode) => { setWish(text, mode); onLevelComplete(5); }} particles={ps} />
                : <Navigate to="/" replace />
            } />
            <Route path="/reveal" element={
              isLevelUnlocked(6)
                ? <WishReveal wishText={state.wishText} wishCipherMode={state.wishCipherMode} onRestart={() => { resetGame(); navigate('/'); }} particles={ps} onRevealComplete={() => onLevelComplete(6)} />
                : <Navigate to="/" replace />
            } />
          </Routes>
        </div>
      </Layout>
    </div>
  );
}

