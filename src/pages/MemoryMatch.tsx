// ══════════════════════════════════════════════════
// Stage 2: MEMORY MATCH — "Mystic Echoes"
// Flip cards to match pairs of mystical symbols
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { playCipherTick, playSuccessChime, playErrorBuzz, playSparkPop, playWhisperHiss } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface MemoryMatchProps {
  onComplete: () => void;
  particles: ParticleSystem | null;
}

interface Card {
  id: number;
  symbol: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = ['★', '☽', '✦', '⚝', '♦', '◆', '⊛', '☾'];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = SYMBOLS.flatMap((symbol, i) => [
    { id: i * 2, symbol, pairId: i, flipped: false, matched: false },
    { id: i * 2 + 1, symbol, pairId: i, flipped: false, matched: false },
  ]);
  return shuffleArray(pairs);
}

export default function MemoryMatch({ onComplete, particles }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const lockRef = useRef(false);

  const totalPairs = SYMBOLS.length;

  useEffect(() => {
    whisper('The willow hides its secrets in pairs... find them all...');
    playWhisperHiss(1.5, 0.05);
  }, []);

  // Check for win
  useEffect(() => {
    if (matchedCount === totalPairs && !solved) {
      setSolved(true);
      playSuccessChime();
      particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 'spark');
      setTimeout(() => onComplete(), 1500);
    }
  }, [matchedCount, totalPairs, solved, onComplete, particles]);

  const handleCardClick = useCallback((id: number) => {
    if (lockRef.current || solved) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    playCipherTick(0.1);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves((m) => m + 1);

      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.pairId === second?.pairId) {
        // Match found!
        playSparkPop(0.15);
        particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 15, 'star');
        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            c.pairId === first.pairId ? { ...c, matched: true } : c
          ));
          setMatchedCount((m) => m + 1);
          setFlippedIds([]);
          lockRef.current = false;
        }, 500);
      } else {
        // No match
        playErrorBuzz(0.06);
        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          lockRef.current = false;
        }, 900);
      }
    }
  }, [cards, flippedIds, solved, particles]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
         style={{ backgroundColor: 'var(--oww-cream)' }}>
      
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8 stagger">
          <span className="oww-tag mb-4 inline-block">LEVEL II</span>
          <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-black)' }}>
            Mystic <span style={{ color: 'var(--oww-red)' }}>Echoes</span>
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] uppercase"
             style={{ color: 'var(--oww-brown-light)' }}>
            Match the mystical symbol pairs to unlock the wish
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                 style={{ color: 'var(--oww-brown-light)' }}>MOVES</p>
              <p className="font-display text-xl font-black"
                 style={{ color: 'var(--oww-black)' }}>{moves}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                 style={{ color: 'var(--oww-brown-light)' }}>PAIRS</p>
              <p className="font-display text-xl font-black">
                <span style={{ color: 'var(--oww-gold)' }}>{matchedCount}</span>
                <span style={{ color: 'var(--oww-brown-light)' }}> / {totalPairs}</span>
              </p>
            </div>
          </div>
          {matchedCount > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: matchedCount }).map((_, i) => (
                <span key={i} className="text-sm anim-letter-pop"
                      style={{ color: 'var(--oww-gold)', animationDelay: `${i * 0.1}s` }}>✦</span>
              ))}
            </div>
          )}
        </div>

        {/* Card grid */}
        <div className="oww-card">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {cards.map((card) => (
              <button key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.flipped || card.matched || lockRef.current}
                      className="relative aspect-square transition-all duration-300"
                      style={{ perspective: '600px' }}>
                <div className={`
                  absolute inset-0 transition-transform duration-500 
                  ${card.flipped || card.matched ? '[transform:rotateY(180deg)]' : ''}
                `}
                     style={{ transformStyle: 'preserve-3d' }}>
                  
                  {/* Card back (face down) */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center border-2 
                    transition-all duration-200 cursor-pointer
                    ${card.matched ? 'opacity-0' : 'hover:border-[var(--oww-red)] hover:shadow-[0_0_10px_rgba(196,30,58,0.15)]'}
                  `}
                       style={{ 
                         backfaceVisibility: 'hidden',
                         borderColor: 'var(--oww-brown-light)',
                         backgroundColor: 'var(--oww-cream-dark)',
                         backgroundImage: `
                           repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(58,42,26,0.04) 8px, rgba(58,42,26,0.04) 9px),
                           repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(58,42,26,0.04) 8px, rgba(58,42,26,0.04) 9px)
                         `,
                       }}>
                    <span className="font-mono text-lg font-bold"
                          style={{ color: 'var(--oww-brown-light)' }}>✦</span>
                  </div>

                  {/* Card front (face up) */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center border-2
                    ${card.matched 
                      ? 'border-[var(--oww-gold)] bg-[rgba(212,168,83,0.15)] shadow-[0_0_15px_rgba(212,168,83,0.2)]' 
                      : 'border-[var(--oww-red)] bg-[var(--oww-cream-light)]'}
                  `}
                       style={{ 
                         backfaceVisibility: 'hidden',
                         transform: 'rotateY(180deg)',
                       }}>
                    <span className={`text-2xl sm:text-3xl transition-all ${
                      card.matched ? 'anim-pulse-gold' : ''
                    }`}
                          style={{ color: card.matched ? 'var(--oww-gold)' : 'var(--oww-red)' }}>
                      {card.symbol}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Solved stamp */}
          {solved && (
            <div className="flex justify-center mt-6 anim-stamp-in">
              <span className="oww-stamp text-sm px-6 py-2"
                    style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-4deg)' }}>
                ✦ ALL PAIRS FOUND ✦
              </span>
            </div>
          )}
        </div>

        {/* Hint */}
        <p className="text-center font-mono text-[10px] tracking-[0.1em] mt-4"
           style={{ color: 'var(--oww-brown-light)' }}>
          FLIP TWO CARDS · FIND ALL {totalPairs} MATCHING PAIRS
        </p>
      </div>
    </div>
  );
}
