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

import Landing from './pages/Landing';
import CaesarCipher from './pages/CaesarCipher';
import MemoryMatch from './pages/MemoryMatch';
import WordChain from './pages/WordChain';
import StarConnect from './pages/StarConnect';
import WishCipher from './pages/WishCipher';
import WishReveal from './pages/WishReveal';

const LEVEL_ROUTES = ['/', '/cipher', '/memory', '/chain', '/stars', '/wish-machine', '/reveal'];

export default function App() {
  const { state, completeLevel, setWish, resetGame, isLevelUnlocked } = useGameState();
  const particlesRef = useRef<ParticleCanvasRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioStarted) {
      startAmbient(0.03);
      setAudioStarted(true);
    }
  }, [audioStarted]);

  const goToLevel = useCallback((level: number) => {
    if (transitioning) return;
    setTransitioning(true);
    playTransitionWhoosh();

    setTimeout(() => {
      navigate(LEVEL_ROUTES[level] || '/');
      setTimeout(() => setTransitioning(false), 300);
    }, 400);
  }, [navigate, transitioning]);

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

      {/* Transition overlay */}
      {transitioning && (
        <div className="fixed inset-0 z-[1000] flex pointer-events-auto">
          <div className="flex-1 anim-fade-in" style={{ backgroundColor: 'var(--oww-black)', animationDuration: '0.3s' }} />
          <div className="flex-1 anim-fade-in" style={{ backgroundColor: 'var(--oww-black)', animationDuration: '0.3s' }} />
        </div>
      )}

      {showProgress && (
        <ProgressBar currentLevel={currentLevelFromRoute} completedLevels={state.completedLevels} />
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
