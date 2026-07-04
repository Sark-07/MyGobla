// ══════════════════════════════════════════════════
// Stage 4: STAR CONNECT — "Spark The Stars"
// Trace a heart constellation by clicking stars
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { playCipherTick, playSuccessChime, playErrorBuzz, playRevelationDrone } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface StarConnectProps {
  onComplete: () => void;
  particles: ParticleSystem | null;
}

// Heart constellation points (normalized 0-1 coordinates)
const HEART_STARS = [
  { x: 0.50, y: 0.22 },  // 0: top center dip
  { x: 0.35, y: 0.15 },  // 1: left upper
  { x: 0.18, y: 0.20 },  // 2: far left
  { x: 0.12, y: 0.35 },  // 3: left curve
  { x: 0.18, y: 0.50 },  // 4: left lower
  { x: 0.30, y: 0.65 },  // 5: lower left
  { x: 0.50, y: 0.85 },  // 6: bottom point
  { x: 0.70, y: 0.65 },  // 7: lower right
  { x: 0.82, y: 0.50 },  // 8: right lower
  { x: 0.88, y: 0.35 },  // 9: right curve
  { x: 0.82, y: 0.20 },  // 10: far right
  { x: 0.65, y: 0.15 },  // 11: right upper
];

// Correct order to trace the heart
const CORRECT_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

// Extra decoy stars scattered around
const DECOY_STARS = [
  { x: 0.08, y: 0.08 }, { x: 0.92, y: 0.10 },
  { x: 0.05, y: 0.70 }, { x: 0.95, y: 0.75 },
  { x: 0.45, y: 0.05 }, { x: 0.55, y: 0.95 },
  { x: 0.15, y: 0.85 }, { x: 0.85, y: 0.88 },
];

export default function StarConnect({ onComplete, particles }: StarConnectProps) {
  const [connected, setConnected] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextExpected = connected.length < CORRECT_ORDER.length ? CORRECT_ORDER[connected.length] : -1;

  useEffect(() => {
    whisper('Find the spark within the stars... connect them to reveal the hidden shape...');
  }, []);

  // Hint timer — pulse the next star after 20s
  useEffect(() => {
    if (solved) return;
    setHintActive(false);
    const timer = setTimeout(() => setHintActive(true), 20000);
    return () => clearTimeout(timer);
  }, [connected.length, solved]);

  // Draw connection lines on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (connected.length < 2) return;

    // Draw connected lines
    ctx.strokeStyle = solved ? '#D4A853' : '#C41E3A';
    ctx.lineWidth = 2;
    ctx.shadowColor = solved ? '#FFD700' : '#C41E3A';
    ctx.shadowBlur = solved ? 12 : 6;
    ctx.beginPath();

    for (let i = 0; i < connected.length; i++) {
      const star = HEART_STARS[connected[i]];
      const px = star.x * canvas.width;
      const py = star.y * canvas.height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Glow dots at each connected point
    connected.forEach((idx) => {
      const star = HEART_STARS[idx];
      const px = star.x * canvas.width;
      const py = star.y * canvas.height;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = solved ? '#FFD700' : '#C41E3A';
      ctx.fill();
    });
  }, [connected, solved]);

  const handleStarClick = useCallback((index: number) => {
    if (solved) return;

    if (index === nextExpected) {
      // Correct star!
      const newConnected = [...connected, index];
      setConnected(newConnected);
      playCipherTick(0.1);

      // Play ascending note
      const noteCtx = new AudioContext();
      const osc = noteCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 220 + newConnected.length * 40;
      const gain = noteCtx.createGain();
      gain.gain.setValueAtTime(0.08, noteCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteCtx.currentTime + 0.4);
      osc.connect(gain).connect(noteCtx.destination);
      osc.start();
      osc.stop(noteCtx.currentTime + 0.45);

      if (newConnected.length === CORRECT_ORDER.length) {
        // Solved!
        setSolved(true);
        playSuccessChime();
        playRevelationDrone(2, 0.04);
        particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 60, 'spark');
        setTimeout(() => onComplete(), 2000);
      }
    } else {
      // Wrong star
      playErrorBuzz(0.06);
      setWrongFlash(index);
      setTimeout(() => setWrongFlash(null), 500);
    }
  }, [connected, nextExpected, solved, onComplete, particles]);

  const handleDecoyClick = useCallback(() => {
    playErrorBuzz(0.04);
  }, []);

  const getStarSize = (index: number) => {
    const isConnected = connected.includes(index);
    const isNext = index === nextExpected && hintActive;
    if (isConnected) return 'w-5 h-5 sm:w-6 sm:h-6';
    if (isNext) return 'w-5 h-5 sm:w-6 sm:h-6';
    return 'w-4 h-4 sm:w-5 sm:h-5';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
         style={{ backgroundColor: 'var(--oww-black-soft)' }}>
      
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6 stagger">
          <span className="oww-tag mb-4 inline-block"
                style={{ backgroundColor: 'var(--oww-black)', borderColor: 'var(--oww-brown-light)' }}>
            LEVEL IV
          </span>
          <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-cream)' }}>
            Spark The <span style={{ color: 'var(--oww-gold)' }}>Stars</span>
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] uppercase"
             style={{ color: 'var(--oww-brown-light)' }}>
            Connect the constellation stars in order · Reveal the hidden shape
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase"
                style={{ color: 'var(--oww-brown-light)' }}>
            STARS: {connected.length} / {CORRECT_ORDER.length}
          </span>
          <div className="flex-1 max-w-32 h-1 rounded-full overflow-hidden"
               style={{ backgroundColor: 'rgba(92,74,53,0.3)' }}>
            <div className="h-full transition-all duration-300 rounded-full"
                 style={{ 
                   width: `${(connected.length / CORRECT_ORDER.length) * 100}%`,
                   backgroundColor: solved ? 'var(--oww-gold)' : 'var(--oww-red)',
                   boxShadow: solved ? '0 0 8px var(--oww-gold)' : undefined,
                 }} />
          </div>
        </div>

        {/* Star field */}
        <div ref={containerRef}
             className="relative border-2 overflow-hidden"
             style={{ 
               aspectRatio: '1',
               borderColor: 'var(--oww-brown-light)',
               backgroundColor: 'rgba(17,17,17,0.9)',
               backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212,168,83,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(196,30,58,0.03) 0%, transparent 50%)',
             }}>
          
          {/* Canvas for connection lines */}
          <canvas ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10" />

          {/* Tiny background stars (decoration) */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={`bg-${i}`}
                 className="absolute w-0.5 h-0.5 rounded-full anim-twinkle"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   backgroundColor: 'var(--oww-cream)',
                   opacity: 0.2 + Math.random() * 0.3,
                   animationDelay: `${Math.random() * 3}s`,
                   animationDuration: `${2 + Math.random() * 3}s`,
                 }} />
          ))}

          {/* Decoy stars */}
          {DECOY_STARS.map((star, i) => (
            <button key={`decoy-${i}`}
                    onClick={handleDecoyClick}
                    className="absolute w-3 h-3 rounded-full transition-all hover:scale-150 z-20 anim-twinkle"
                    style={{
                      left: `${star.x * 100}%`,
                      top: `${star.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'var(--oww-cream)',
                      opacity: 0.3,
                      animationDelay: `${Math.random() * 2}s`,
                    }} />
          ))}

          {/* Heart constellation stars */}
          {HEART_STARS.map((star, i) => {
            const isConnected = connected.includes(i);
            const isNext = i === nextExpected;
            const isWrong = wrongFlash === i;
            
            return (
              <button key={`star-${i}`}
                      onClick={() => handleStarClick(i)}
                      className={`
                        absolute rounded-full transition-all duration-300 z-30
                        ${getStarSize(i)}
                        ${isWrong ? 'anim-shake' : ''}
                        ${isNext && hintActive ? 'anim-pulse-ember' : ''}
                        ${!isConnected && !solved ? 'hover:scale-150 cursor-pointer' : ''}
                      `}
                      style={{
                        left: `${star.x * 100}%`,
                        top: `${star.y * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: isConnected 
                          ? (solved ? 'var(--oww-gold)' : 'var(--oww-red)')
                          : 'var(--oww-cream)',
                        boxShadow: isConnected
                          ? (solved 
                              ? '0 0 12px var(--oww-gold), 0 0 24px rgba(212,168,83,0.3)' 
                              : '0 0 8px var(--oww-red), 0 0 16px rgba(196,30,58,0.3)')
                          : isNext && hintActive
                            ? '0 0 12px var(--oww-gold)'
                            : '0 0 4px rgba(241,231,207,0.5)',
                        opacity: isConnected ? 1 : 0.7,
                      }}>
                {/* Star number (small) */}
                {isConnected && (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold"
                        style={{ color: solved ? 'var(--oww-black)' : 'var(--oww-cream)' }}>
                    {connected.indexOf(i) + 1}
                  </span>
                )}
              </button>
            );
          })}

          {/* Solved overlay */}
          {solved && (
            <div className="absolute inset-0 flex items-center justify-center z-40 anim-fade-in"
                 style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <div className="text-center">
                <p className="font-mystical text-4xl font-bold anim-pulse-gold"
                   style={{ color: 'var(--oww-gold)', textShadow: '0 0 20px rgba(212,168,83,0.5)' }}>
                  ♥
                </p>
                <p className="font-mono text-xs tracking-[0.15em] uppercase mt-2"
                   style={{ color: 'var(--oww-gold)' }}>
                  CONSTELLATION REVEALED
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-4">
          <p className="font-mono text-[10px] tracking-[0.1em]"
             style={{ color: 'var(--oww-brown-light)' }}>
            CLICK THE BRIGHT STARS IN ORDER · AVOID THE DIM ONES
          </p>
          {hintActive && !solved && (
            <p className="font-mono text-[10px] tracking-[0.1em] mt-1 anim-pulse-gold"
               style={{ color: 'var(--oww-gold)' }}>
              ✦ HINT: LOOK FOR THE GLOWING STAR ✦
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
