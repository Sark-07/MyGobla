// ══════════════════════════════════════════════════
// Stage 5: WISH REVEAL — "Your Wish Has Been Granted"
// Final celebration — mystical, not cheery
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { playRevelationDrone, playTrumpetFanfare, playCrackle } from '../lib/sfx';
import { narrate } from '../lib/voice';
import { applyCipher, type CipherMode } from '../lib/ciphers';
import type { ParticleSystem } from '../lib/particles';

interface WishRevealProps {
  wishText: string;
  wishCipherMode: string;
  onRestart: () => void;
  particles: ParticleSystem | null;
}

const BIRTHDAY_MESSAGE = `Gobla,

From the moment you opened this box, you embarked on a journey — 
through ciphers, symbols, and words — all leading here, to this moment.

Every puzzle was a piece of you. The spark, the heart, the dream, the magic.

You are extraordinary. You are loved. You are the wish that came true.

Happy Birthday, Gobla.

The willow has spoken. Your wish is sealed forever.

With all my love, always and forever ✦`;

export default function WishReveal({ wishText, wishCipherMode, onRestart, particles }: WishRevealProps) {
  const [phase, setPhase] = useState<'intro' | 'decipher' | 'message' | 'full'>('intro');
  const [decipherProgress, setDecipherProgress] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const cipheredWish = wishText ? applyCipher(wishText, wishCipherMode as CipherMode) : '';

  // Phase progression
  useEffect(() => {
    // Intro phase
    playRevelationDrone(5, 0.06);
    playCrackle(3, 0.04);

    const timer1 = setTimeout(() => {
      setPhase('decipher');
      particles?.start('ember', 3);
    }, 2000);

    const timer2 = setTimeout(() => {
      setPhase('message');
      playTrumpetFanfare(0.1);
      particles?.start('star', 2);
    }, 6000);

    const timer3 = setTimeout(() => {
      setPhase('full');
      setShowPhotos(true);
      narrate('Happy Birthday, Gobla. Your wish has been granted.');
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      particles?.stop();
    };
  }, [particles]);

  // Decipher animation — gradually reveal plain text
  useEffect(() => {
    if (phase !== 'decipher' || !cipheredWish) return;
    const interval = setInterval(() => {
      setDecipherProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phase, cipheredWish]);

  // Typewriter effect for birthday message
  useEffect(() => {
    if (phase !== 'message' && phase !== 'full') return;
    const interval = setInterval(() => {
      setTypedChars((c) => {
        if (c >= BIRTHDAY_MESSAGE.length) { clearInterval(interval); return c; }
        return c + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [phase]);

  // Build partially deciphered text
  const getDecipheredText = useCallback(() => {
    if (!cipheredWish || !wishText) return '';
    const progress = decipherProgress / 100;
    return cipheredWish.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      return Math.random() < progress ? wishText[i] || ch : ch;
    }).join('');
  }, [cipheredWish, wishText, decipherProgress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 anim-breathing-glow"
         style={{ backgroundColor: 'var(--oww-black-soft)', minHeight: '100vh' }}>
      
      <div className="max-w-2xl w-full pt-8">
        
        {/* ── Phase: Intro ── */}
        {phase === 'intro' && (
          <div className="text-center anim-fade-in" style={{ animationDuration: '1.5s' }}>
            <p className="font-mono text-xs tracking-[1em] mb-8"
               style={{ color: 'var(--oww-gold)' }}>
              ✦ ✦ ✦
            </p>
            <p className="font-mono text-sm tracking-[0.15em] uppercase anim-flicker"
               style={{ color: 'var(--oww-cream-dark)' }}>
              Your wish is being granted...
            </p>
          </div>
        )}

        {/* ── Phase: Decipher ── */}
        {(phase === 'decipher' || phase === 'message' || phase === 'full') && (
          <div className="mb-8 anim-fade-in">
            {/* Gobla's wish deciphering */}
            {wishText && (
              <div className="text-center mb-8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-3"
                   style={{ color: 'var(--oww-brown-light)' }}>
                  YOUR SEALED WISH:
                </p>
                <div className="inline-block p-4 border-2"
                     style={{ 
                       borderColor: decipherProgress >= 100 ? 'var(--oww-gold)' : 'var(--oww-brown-light)',
                       backgroundColor: 'rgba(26,26,26,0.8)',
                     }}>
                  <p className={`font-mono text-lg font-bold tracking-[0.1em] transition-colors duration-500 ${
                    decipherProgress >= 100 ? 'anim-pulse-gold' : ''
                  }`}
                     style={{ color: decipherProgress >= 100 ? 'var(--oww-gold)' : 'var(--oww-red)' }}>
                    {decipherProgress >= 100 ? wishText : getDecipheredText()}
                  </p>
                </div>
                {decipherProgress >= 100 && (
                  <p className="font-mono text-[10px] tracking-[0.1em] uppercase mt-2 anim-fade-in"
                     style={{ color: 'var(--oww-gold)' }}>
                    ✦ WISH DECIPHERED ✦
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Phase: Message ── */}
        {(phase === 'message' || phase === 'full') && (
          <div className="anim-fade-in-up">
            {/* Name reveal */}
            <div className="text-center mb-8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-4"
                 style={{ color: 'var(--oww-brown-light)' }}>
                ★ THIS WISH WAS GRANTED FOR ★
              </p>
              <h1 className="font-mystical text-5xl sm:text-7xl font-bold anim-pulse-gold"
                  style={{ 
                    color: 'var(--oww-gold)',
                    textShadow: '0 0 20px rgba(212,168,83,0.4), 0 0 40px rgba(212,168,83,0.2)',
                  }}>
                Gobla
              </h1>
              <div className="oww-divider my-6" style={{ backgroundColor: 'var(--oww-gold)', opacity: 0.3 }} />
            </div>

            {/* Birthday message — typewriter */}
            <div ref={messageRef}
                 className="p-6 sm:p-8 border-2 mb-8 relative"
                 style={{ 
                   borderColor: 'var(--oww-brown-light)',
                   backgroundColor: 'rgba(241,231,207,0.06)',
                 }}>
              {/* Inner border */}
              <div className="absolute inset-2 border pointer-events-none"
                   style={{ borderColor: 'rgba(212,168,83,0.15)' }} />

              <p className="font-display text-base sm:text-lg leading-relaxed whitespace-pre-line"
                 style={{ color: 'var(--oww-cream-dark)' }}>
                {BIRTHDAY_MESSAGE.slice(0, typedChars)}
                {typedChars < BIRTHDAY_MESSAGE.length && (
                  <span className="anim-cursor">&nbsp;</span>
                )}
              </p>
            </div>

            {/* ── Photo Gallery (Placeholders) ── */}
            {showPhotos && (
              <div className="grid grid-cols-3 gap-3 mb-8 anim-fade-in-up" style={{ animationDelay: '0.5s' }}>
                {[1, 2, 3].map((n) => (
                  <div key={n}
                       className="aspect-[3/4] border-2 flex flex-col items-center justify-center p-3 relative overflow-hidden group"
                       style={{ 
                         borderColor: 'var(--oww-cream-dark)',
                         backgroundColor: 'rgba(241,231,207,0.08)',
                       }}>
                    {/* Placeholder content */}
                    <div className="text-center">
                      <p className="text-2xl mb-2" style={{ color: 'var(--oww-gold)' }}>✦</p>
                      <p className="font-mono text-[9px] tracking-[0.1em] uppercase"
                         style={{ color: 'var(--oww-brown-light)' }}>
                        PHOTO {n}
                      </p>
                      <p className="font-mono text-[8px] mt-1"
                         style={{ color: 'var(--oww-brown-light)', opacity: 0.6 }}>
                        Place Gobla's<br/>photo here
                      </p>
                    </div>
                    {/* Corner decorations */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l"
                         style={{ borderColor: 'var(--oww-gold)' }} />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r"
                         style={{ borderColor: 'var(--oww-gold)' }} />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l"
                         style={{ borderColor: 'var(--oww-gold)' }} />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r"
                         style={{ borderColor: 'var(--oww-gold)' }} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Vintage Product Card Footer ── */}
            {phase === 'full' && typedChars >= BIRTHDAY_MESSAGE.length && (
              <div className="anim-fade-in-up" style={{ animationDelay: '1s' }}>
                <div className="p-4 border-2 border-dashed mb-6"
                     style={{ borderColor: 'var(--oww-brown-light)', backgroundColor: 'rgba(241,231,207,0.05)' }}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                         style={{ color: 'var(--oww-brown-light)' }}>
                        SEALED ON: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                         style={{ color: 'var(--oww-brown-light)' }}>
                        WISH #0001 — FOR GOBLA — IRREVERSIBLE
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="oww-stamp text-[8px] py-0.5 px-2"
                            style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(-3deg)' }}>
                        GENUINE
                      </span>
                      <span className="oww-stamp text-[8px] py-0.5 px-2"
                            style={{ color: 'var(--oww-red)', borderColor: 'var(--oww-red)', transform: 'rotate(2deg)' }}>
                        GRANTED
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-[9px] text-center mt-3"
                     style={{ color: 'var(--oww-brown-light)', opacity: 0.6 }}>
                    100% MAGICAL · 0% REAL · ONE WISH WILLOW™
                  </p>
                </div>

                {/* Replay button */}
                <div className="text-center">
                  <button onClick={onRestart}
                          className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase
                                     px-6 py-3 border transition-all duration-300
                                     text-[var(--oww-brown-light)] border-[var(--oww-brown-light)]
                                     hover:text-[var(--oww-cream)] hover:border-[var(--oww-cream)]
                                     hover:bg-[rgba(241,231,207,0.1)]">
                    ⟳ Start A New Wish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
