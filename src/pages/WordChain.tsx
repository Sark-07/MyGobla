// ══════════════════════════════════════════════════
// Stage 3: WORD CHAIN — "Spark The Middle"
// Word chain puzzle along a visual willow branch
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { playCipherTick, playSuccessChime, playErrorBuzz, playWoodCreak, playSparkPop } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface WordChainProps {
  onComplete: () => void;
  particles: ParticleSystem | null;
}

interface ChainLink {
  answer: string;
  clue: string;
  hint: string;
}

const CHAIN: ChainLink[] = [
  { answer: 'SPARK', clue: 'A tiny flash that starts a fire', hint: 'S _ _ _ K' },
  { answer: 'PARTY', clue: 'A celebration with friends and cake', hint: 'P _ _ _ Y' },
  { answer: 'HEART', clue: 'Where love lives, it beats for you', hint: 'H _ _ _ T' },
  { answer: 'DREAM', clue: 'What you see when you close your eyes and wish', hint: 'D _ _ _ M' },
  { answer: 'LOVE', clue: 'The invisible spell that binds two hearts together', hint: 'L _ _ E' },
];

export default function WordChain({ onComplete, particles }: WordChainProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [allSolved, setAllSolved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    whisper('Follow the branch... each word leads to the next...');
    playWoodCreak(1, 0.06);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  // Hint timer
  useEffect(() => {
    setShowHint(false);
    const timer = setTimeout(() => setShowHint(true), 15000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const guess = input.toUpperCase().trim();
    const current = CHAIN[currentIndex];

    if (guess === current.answer) {
      setSolvedWords((prev) => [...prev, current.answer]);
      playCipherTick();
      playSparkPop();
      particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 20, 'ember');
      setInput('');

      if (currentIndex === CHAIN.length - 1) {
        setAllSolved(true);
        playSuccessChime();
        setTimeout(() => onComplete(), 1500);
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 600);
      }
    } else {
      playErrorBuzz(0.08);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  }, [input, currentIndex, onComplete, particles]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-16"
         style={{ backgroundColor: 'var(--oww-cream)' }}>
      
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8 stagger">
          <span className="oww-tag mb-4 inline-block">LEVEL III</span>
          <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-black)' }}>
            Spark The <span style={{ color: 'var(--oww-red)' }}>Middle</span>
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] uppercase"
             style={{ color: 'var(--oww-brown-light)' }}>
            Solve each word to light the willow branch
          </p>
        </div>

        {/* ── Willow Branch Visualization ── */}
        <div className="oww-card mb-6">
          <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center mb-6"
             style={{ color: 'var(--oww-red)' }}>
            ✦ THE WILLOW BRANCH ✦
          </p>

          {/* Branch nodes */}
          <div className="relative">
            {CHAIN.map((link, i) => {
              const isSolved = solvedWords.includes(link.answer);
              const isCurrent = i === currentIndex && !allSolved;


              return (
                <div key={i} className="flex items-center gap-4 mb-1 last:mb-0">
                  {/* Branch line + node */}
                  <div className="flex flex-col items-center" style={{ width: '40px' }}>
                    {/* Top connector */}
                    {i > 0 && (
                      <div className="w-0.5 h-3 transition-colors duration-500"
                           style={{ backgroundColor: solvedWords.includes(CHAIN[i - 1].answer) ? 'var(--oww-gold)' : 'var(--oww-brown-light)' }} />
                    )}
                    {/* Node */}
                    <div className={`
                      w-8 h-8 flex items-center justify-center border-2 transition-all duration-500
                      font-mono text-xs font-bold
                      ${isSolved 
                        ? 'border-[var(--oww-gold)] bg-[var(--oww-gold)] text-[var(--oww-black)] shadow-[0_0_12px_rgba(212,168,83,0.4)]'
                        : isCurrent 
                          ? 'border-[var(--oww-red)] bg-transparent text-[var(--oww-red)] anim-pulse-ember'
                          : 'border-[var(--oww-brown-light)] bg-transparent text-[var(--oww-brown-light)] opacity-40'}
                    `}>
                      {isSolved ? '✦' : i + 1}
                    </div>
                    {/* Bottom connector */}
                    {i < CHAIN.length - 1 && (
                      <div className="w-0.5 h-3 transition-colors duration-500"
                           style={{ backgroundColor: isSolved ? 'var(--oww-gold)' : 'var(--oww-brown-light)' }} />
                    )}
                  </div>

                  {/* Word card */}
                  <div className={`
                    flex-1 p-3 border-2 transition-all duration-500
                    ${isSolved 
                      ? 'border-[var(--oww-gold)] bg-[rgba(212,168,83,0.08)]'
                      : isCurrent 
                        ? 'border-[var(--oww-black)] bg-[var(--oww-cream-light)]'
                        : 'border-[var(--oww-brown-light)] bg-transparent opacity-40'}
                  `}>
                    {isSolved ? (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold tracking-[0.12em]"
                              style={{ color: 'var(--oww-gold)' }}>
                          {link.answer}
                        </span>
                        <span className="oww-stamp text-[8px] py-0.5 px-2"
                              style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-3deg)' }}>
                          SOLVED
                        </span>
                      </div>
                    ) : isCurrent ? (
                      <div>
                        <p className="font-display text-sm italic mb-1"
                           style={{ color: 'var(--oww-brown)' }}>
                          "{link.clue}"
                        </p>
                        {showHint && (
                          <p className="font-mono text-xs tracking-[0.15em] anim-fade-in"
                             style={{ color: 'var(--oww-red)' }}>
                            HINT: {link.hint}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-mono text-xs" style={{ color: 'var(--oww-brown-light)' }}>
                        ? ? ? ? ?
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Input Area ── */}
        {!allSolved && (
          <div className="oww-card">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                maxLength={10}
                className={`flex-1 font-mono text-sm font-bold tracking-[0.08em] uppercase
                           px-4 py-3 border-2 bg-[var(--oww-cream-light)] outline-none
                           transition-colors focus:border-[var(--oww-red)]
                           ${shaking ? 'anim-shake' : ''}`}
                style={{ borderColor: 'var(--oww-brown-light)', color: 'var(--oww-black)' }}
              />
              <button type="submit"
                      className="font-mono text-sm font-bold tracking-[0.08em] uppercase
                                 px-6 py-3 border-2 border-[var(--oww-black)] bg-[var(--oww-black)]
                                 text-[var(--oww-cream)] transition-colors
                                 hover:bg-[var(--oww-cream)] hover:text-[var(--oww-black)]">
                ✦
              </button>
            </form>
            <p className="font-mono text-[10px] mt-3 text-center"
               style={{ color: 'var(--oww-brown-light)' }}>
              WORD {currentIndex + 1} OF {CHAIN.length}
            </p>
          </div>
        )}

        {/* Solved stamp */}
        {allSolved && (
          <div className="flex justify-center mt-4 anim-stamp-in">
            <span className="oww-stamp text-sm px-6 py-2"
                  style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-4deg)' }}>
              ✦ BRANCH IGNITED ✦
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
