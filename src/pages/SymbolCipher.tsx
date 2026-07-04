// ══════════════════════════════════════════════════
// Stage 2: SYMBOL CIPHER — "Make A Wish"
// Symbol-to-letter substitution puzzle
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { SYMBOL_MAP } from '../lib/ciphers';
import { playCipherTick, playSuccessChime, playErrorBuzz, playWhisperHiss } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface SymbolCipherProps {
  onComplete: () => void;
  particles: ParticleSystem | null;
}

const MESSAGE = 'YOU ARE MY UNIVERSE';
const REVEALED_PERCENT = 0.4; // 40% of mappings given

// Create reverse map
const REVERSE_MAP: Record<string, string> = {};
Object.entries(SYMBOL_MAP).forEach(([letter, symbol]) => {
  REVERSE_MAP[symbol] = letter;
});

// Encode the message
const encodedChars = MESSAGE.split('').map((ch) => ({
  original: ch,
  symbol: ch === ' ' ? ' ' : SYMBOL_MAP[ch] || ch,
  isSpace: ch === ' ',
  letter: ch,
}));

// Determine which unique letters are "given" in the codebook
const uniqueLetters = [...new Set(MESSAGE.replace(/ /g, '').split(''))];
const givenCount = Math.ceil(uniqueLetters.length * REVEALED_PERCENT);
const shuffled = [...uniqueLetters].sort(() => Math.random() - 0.5);
const givenLetters = new Set(shuffled.slice(0, givenCount));

export default function SymbolCipher({ onComplete, particles }: SymbolCipherProps) {
  const [guesses, setGuesses] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    givenLetters.forEach((letter) => {
      initial[SYMBOL_MAP[letter]] = letter;
    });
    return initial;
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [wrongShake, setWrongShake] = useState<string | null>(null);

  useEffect(() => {
    whisper('The willow speaks in symbols... decode its ancient tongue...');
    playWhisperHiss(2, 0.06);
  }, []);

  // Check if puzzle is solved
  useEffect(() => {
    if (solved) return;
    const allCorrect = encodedChars.every((ch) => {
      if (ch.isSpace) return true;
      return guesses[ch.symbol] === ch.letter;
    });
    if (allCorrect && Object.keys(guesses).length >= uniqueLetters.length) {
      setSolved(true);
      playSuccessChime();
      particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 'spark');
      setTimeout(() => onComplete(), 1500);
    }
  }, [guesses, solved, onComplete, particles]);

  const handleSymbolClick = useCallback((symbol: string) => {
    if (solved) return;
    if (givenLetters.has(REVERSE_MAP[symbol])) return; // Can't change given letters
    setSelectedSymbol(symbol);
    playCipherTick();
  }, [solved]);

  const handleLetterInput = useCallback((e: React.KeyboardEvent) => {
    if (!selectedSymbol || solved) return;
    const letter = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;

    const correctLetter = REVERSE_MAP[selectedSymbol];
    if (letter === correctLetter) {
      setGuesses((prev) => ({ ...prev, [selectedSymbol]: letter }));
      playCipherTick();
      setSelectedSymbol(null);
    } else {
      playErrorBuzz(0.08);
      setWrongShake(selectedSymbol);
      setTimeout(() => setWrongShake(null), 400);
    }
  }, [selectedSymbol, solved]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-16"
         style={{ backgroundColor: 'var(--oww-cream)' }}
         tabIndex={0}
         onKeyDown={handleLetterInput}>
      
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 stagger">
          <span className="oww-tag mb-4 inline-block">LEVEL II</span>
          <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-black)' }}>
            Make A <span style={{ color: 'var(--oww-red)' }}>Wish</span>
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] uppercase"
             style={{ color: 'var(--oww-brown-light)' }}>
            Click a symbol, then type the letter it represents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.2fr] gap-6">
          
          {/* ── Codebook ── */}
          <div className="oww-card">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center mb-4"
               style={{ color: 'var(--oww-red)' }}>
              ✦ PARTIAL CODEBOOK ✦
            </p>
            <div className="grid grid-cols-2 gap-1">
              {[...givenLetters].sort().map((letter) => (
                <div key={letter}
                     className="flex items-center gap-2 py-1 px-2 border-b"
                     style={{ borderColor: 'var(--oww-cream-dark)' }}>
                  <span className="text-lg" style={{ color: 'var(--oww-gold)' }}>
                    {SYMBOL_MAP[letter]}
                  </span>
                  <span className="font-mono text-xs font-bold">= {letter}</span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] mt-3 text-center"
               style={{ color: 'var(--oww-brown-light)' }}>
              REMAINING: DECODE BY CONTEXT
            </p>
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-0.5" style={{ backgroundColor: 'var(--oww-black)' }} />

          {/* ── Encoded Message ── */}
          <div className="oww-card">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center mb-4"
               style={{ color: 'var(--oww-red)' }}>
              ✦ ENCODED MESSAGE ✦
            </p>

            {/* Message display */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 mb-6">
              {encodedChars.map((ch, i) => {
                if (ch.isSpace) {
                  return <div key={i} className="w-4" />;
                }
                const isGuessed = guesses[ch.symbol] === ch.letter;
                const isGiven = givenLetters.has(ch.letter);
                const isSelected = selectedSymbol === ch.symbol;
                const isShaking = wrongShake === ch.symbol;

                return (
                  <div key={i}
                       onClick={() => handleSymbolClick(ch.symbol)}
                       className={`
                         flex flex-col items-center gap-1 cursor-pointer transition-all duration-200
                         ${isSelected ? 'scale-110' : 'hover:scale-105'}
                         ${isShaking ? 'anim-shake' : ''}
                       `}>
                    {/* Symbol */}
                    <div className={`
                      w-9 h-9 flex items-center justify-center text-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-[var(--oww-red)] bg-[rgba(196,30,58,0.1)] shadow-[0_0_10px_rgba(196,30,58,0.2)]'
                        : isGuessed
                          ? 'border-[var(--oww-gold)] bg-[rgba(212,168,83,0.1)]'
                          : 'border-[var(--oww-brown-light)]'}
                    `}
                    style={{ color: 'var(--oww-gold)' }}>
                      {ch.symbol}
                    </div>
                    {/* Letter slot */}
                    <div className={`
                      w-9 h-6 flex items-center justify-center font-mono text-sm font-bold border-b-2
                      ${isGuessed || isGiven
                        ? 'border-[var(--oww-gold)] text-[var(--oww-red)]'
                        : 'border-[var(--oww-brown-light)] text-[var(--oww-brown-light)]'}
                    `}>
                      {guesses[ch.symbol] || (isGiven ? ch.letter : '_')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected symbol indicator */}
            {selectedSymbol && (
              <div className="text-center p-3 border-2 border-dashed anim-fade-in"
                   style={{ borderColor: 'var(--oww-red)', backgroundColor: 'rgba(196,30,58,0.05)' }}>
                <p className="font-mono text-xs" style={{ color: 'var(--oww-brown-light)' }}>
                  TYPE THE LETTER FOR:
                </p>
                <span className="text-3xl" style={{ color: 'var(--oww-gold)' }}>
                  {selectedSymbol}
                </span>
              </div>
            )}

            {/* Solved stamp */}
            {solved && (
              <div className="flex justify-center mt-6 anim-stamp-in">
                <span className="oww-stamp text-sm px-6 py-2"
                      style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-4deg)' }}>
                  ✦ WISH RECEIVED ✦
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
