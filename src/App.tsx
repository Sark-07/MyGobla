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
      setTimeout(() => setTransitionState('idle'), 600);
    }, 600);
  }, [navigate, transitionState]);

  const onLevelComplete = useCallback((level: number) => {
    completeLevel(level);
    setTimeout(() => goToLevel(level + 1), 800);
  }, [completeLevel, goToLevel]);

  const showProgress = location.pathname !== '/';
  const currentLevelFromRoute = LEVEL_ROUTES.indexOf(location.pathname);

  const ps = particlesRef.current?.system ?? null;

  return (
    <>
      <ParticleCanvas ref={particlesRef} />

      {/* Magical Curtain Transition */}
      {transitionState !== 'idle' && (
        <div className="fixed inset-0 z-[1000] flex pointer-events-auto overflow-hidden">
          <div className={`curtain curtain-left ${transitionState}`} />
          <div className={`curtain curtain-right ${transitionState}`} />
        </div>
      )}

      {showProgress && (
        <ProgressBar 
          currentLevel={currentLevelFromRoute - 1} 
          completedLevels={state.completedLevels.map(c => c - 1).filter(c => c >= 0)} 
        />
      )}

      <div className={`${showProgress ? 'pt-12' : ''} min-h-screen`}>
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
              ? <WishReveal wishText={state.wishText} wishCipherMode={state.wishCipherMode} onRestart={() => { resetGame(); navigate('/'); }} particles={ps} />
              : <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </>
  );
}
