// ══════════════════════════════════════════════════
// Stage 1: CAESAR CIPHER — "Remove From The Box"
// Interactive cipher wheel to decode a message
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react';
import { caesarDecipher } from '../lib/ciphers';
import { playCipherTick, playSuccessChime, playErrorBuzz, playCrackle } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface CaesarCipherProps {
  onComplete: () => void;
  particles: ParticleSystem | null;
}

const SECRET_MESSAGE = 'GREAT JOB GOBLA';
const SOLVED_SUFFIX = ' ⁠♡ GO ON';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function CaesarCipher({ onComplete, particles }: CaesarCipherProps) {
  const { correctShift, encodedMessage } = useMemo(() => {
    const shift = Math.floor(Math.random() * 25) + 1; // Random shift 1-25
    const encoded = SECRET_MESSAGE.split('').map((ch) => {
      if (ch === ' ') return ' ';
      const i = ALPHABET.indexOf(ch);
      return i === -1 ? ch : ALPHABET[(i + shift) % 26];
    }).join('');
    return { correctShift: shift, encodedMessage: encoded };
  }, []);

  const [shift, setShift] = useState(0);
  const [solved, setSolved] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const decoded = caesarDecipher(encodedMessage, shift);
  const isCorrect = shift === correctShift;

  useEffect(() => {
    whisper('The seals are locked with letters... turn the wheel to break them...');
    playCrackle(1.5, 0.08);
  }, []);

  useEffect(() => {
    if (isCorrect && !solved) {
      setSolved(true);
      playSuccessChime();
      particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 40, 'spark');
      setTimeout(() => onComplete(), 4500);
    }
  }, [isCorrect, solved, onComplete, particles]);

  const changeShift = useCallback((newShift: number) => {
    const s = ((newShift % 26) + 26) % 26;
    setShift(s);
    playCipherTick();
  }, []);

  const handleWheelClick = (index: number) => {
    changeShift(index);
    if (index !== correctShift) {
      playErrorBuzz(0.06);
      setShakeKey((k) => k + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-16"
         style={{ backgroundColor: 'var(--oww-cream)' }}>
      
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8 stagger">
          <span className="oww-tag mb-4 inline-block">LEVEL I</span>
          <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-black)' }}>
            Decode The<br /><span style={{ color: 'var(--oww-red)' }}>Cipher Wheel</span>
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] uppercase"
             style={{ color: 'var(--oww-brown-light)' }}>
            Rotate the cipher wheel to decode the message
          </p>
        </div>

        {/* Cipher Wheel */}
        <div className="oww-card mb-6">
          <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center mb-4"
             style={{ color: 'var(--oww-red)' }}>
            ✦ CIPHER WHEEL — SELECT SHIFT VALUE ✦
          </p>

          {/* Wheel visualization */}
          <div className="relative mx-auto mb-6" style={{ width: '280px', height: '280px' }}>
            {/* Outer ring — fixed */}
            <div className="absolute inset-0 rounded-full border-2"
                 style={{ borderColor: 'var(--oww-black)' }}>
              {ALPHABET.split('').map((letter, i) => {
                const angle = (i * 360) / 26 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 128;
                const x = 140 + r * Math.cos(rad);
                const y = 140 + r * Math.sin(rad);
                return (
                  <span key={`outer-${i}`}
                        className="absolute font-mono text-xs font-bold"
                        style={{
                          left: `${x}px`, top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                          color: 'var(--oww-black)',
                        }}>
                    {letter}
                  </span>
                );
              })}
            </div>

            {/* Inner ring — rotated */}
            <div className="absolute rounded-full border-2"
                 style={{ 
                   inset: '24px',
                   borderColor: 'var(--oww-red)',
                   backgroundColor: 'rgba(196, 30, 58, 0.05)',
                   transform: `rotate(${(shift * 360) / 26}deg)`,
                   transition: 'transform 0.3s ease-out',
                 }}>
              {ALPHABET.split('').map((letter, i) => {
                const angle = (i * 360) / 26 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 104;
                const cx = 116;
                const x = cx + r * Math.cos(rad);
                const y = cx + r * Math.sin(rad);
                return (
                  <span key={`inner-${i}`}
                        className="absolute font-mono text-xs font-bold"
                        style={{
                          left: `${x}px`, top: `${y}px`,
                          transform: `translate(-50%, -50%) rotate(-${(shift * 360) / 26}deg)`,
                          color: 'var(--oww-red)',
                        }}>
                    {letter}
                  </span>
                );
              })}
            </div>

            {/* Center */}
            <div className="absolute rounded-full flex items-center justify-center"
                 style={{
                   inset: '90px',
                   backgroundColor: 'var(--oww-cream-dark)',
                   border: '2px solid var(--oww-brown)',
                 }}>
              <div className="text-center">
                <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                   style={{ color: 'var(--oww-brown-light)' }}>SHIFT</p>
                <p className="font-display text-3xl font-black"
                   style={{ color: isCorrect ? 'var(--oww-gold)' : 'var(--oww-red)' }}>
                  {shift}
                </p>
              </div>
            </div>
          </div>

          {/* Shift buttons */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={() => changeShift(shift - 1)}
                    disabled={isCorrect}
                    className="font-mono text-lg font-bold w-10 h-10 border-2 flex items-center justify-center
                               transition-colors hover:bg-[var(--oww-black)] hover:text-[var(--oww-cream)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: 'var(--oww-black)', color: 'var(--oww-black)' }}>
              ←
            </button>
            <div className="flex gap-1 flex-wrap justify-center max-w-xs">
              {Array.from({ length: 26 }, (_, i) => (
                <button key={i} onClick={() => handleWheelClick(i)}
                        disabled={isCorrect}
                        className={`w-6 h-6 text-[10px] font-mono font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                          ${i === shift 
                            ? 'bg-[var(--oww-red)] text-[var(--oww-cream)] border-[var(--oww-red)]' 
                            : 'border-[var(--oww-brown-light)] text-[var(--oww-brown-light)] hover:border-[var(--oww-black)] hover:text-[var(--oww-black)]'
                          }`}>
                  {i}
                </button>
              ))}
            </div>
            <button onClick={() => changeShift(shift + 1)}
                    disabled={isCorrect}
                    className="font-mono text-lg font-bold w-10 h-10 border-2 flex items-center justify-center
                               transition-colors hover:bg-[var(--oww-black)] hover:text-[var(--oww-cream)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: 'var(--oww-black)', color: 'var(--oww-black)' }}>
              →
            </button>
          </div>

          {/* Divider */}
          <div className="oww-divider mb-6" />

          {/* Encoded message */}
          <div className="mb-4">
            <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase mb-2"
               style={{ color: 'var(--oww-brown-light)' }}>
              INTERCEPTED TRANSMISSION:
            </p>
            <div className="p-3 border-2 border-dashed"
                 style={{ borderColor: 'var(--oww-brown-light)', backgroundColor: 'var(--oww-cream-dark)' }}>
              <p className="oww-cipher-text text-center break-all">{encodedMessage}</p>
            </div>
          </div>

          {/* Decoded preview */}
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase mb-2"
               style={{ color: 'var(--oww-brown-light)' }}>
              DECODED (SHIFT {shift}):
            </p>
            <div key={shakeKey}
                 className={`p-3 border-2 transition-all duration-300 ${
                   solved 
                     ? 'border-[var(--oww-gold)] bg-[rgba(212,168,83,0.1)]' 
                     : 'border-[var(--oww-black)]'
                 } ${shakeKey > 0 && !solved ? 'anim-shake' : ''}`}
                 style={{ backgroundColor: solved ? undefined : 'var(--oww-cream-light)' }}>
              <p className={`font-mono text-lg font-bold tracking-[0.12em] text-center break-all transition-colors ${
                solved ? 'text-[var(--oww-gold)] anim-pulse-gold' : 'text-[var(--oww-black)]'
              }`}>
                {decoded}{isCorrect ? SOLVED_SUFFIX : ''}
              </p>
            </div>
          </div>

          {/* Solved stamp */}
          {solved && (
            <div className="flex justify-center mt-6 anim-stamp-in">
              <span className="oww-stamp text-sm px-6 py-2"
                    style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-4deg)' }}>
                ✦ DECODED ✦
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
