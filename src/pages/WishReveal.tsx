// ══════════════════════════════════════════════════
// Stage 5: WISH REVEAL — "Your Wish Has Been Granted"
// Final celebration — mystical, not cheery
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { playTrumpetFanfare, playCrackle } from '../lib/sfx';
import { narrate } from '../lib/voice';
import { applyCipher, type CipherMode } from '../lib/ciphers';
import type { ParticleSystem } from '../lib/particles';
import emailjs from '@emailjs/browser';

interface WishRevealProps {
  wishText: string;
  wishCipherMode: string;
  onRestart: () => void;
  particles: ParticleSystem | null;
  onRevealComplete?: () => void;
}

const BIRTHDAY_MESSAGE = `I still remember seeing you on March 11th, 2025 at 1:33 PM—a person so jolly, charming, and full of life. You quickly became a very good, and then a very close, friend of mine. I slowly realized just how beautifully different you are, and how uniquely you see the world. You showed me that there is so much more to life than just living.

When I felt low, you stayed. You listened. You brought emotions with you—emotions I hadn't understood in all my 25 years of life. In such a short amount of time, you have taught me so many things about life itself, what it means to truly live. You make me smile; You make my days brighter.

So, the moment you opened this box, you embarked on a journey—through ciphers, symbols, and words—all leading here, to this moment. This is just my small way of trying to make something beautiful for you, with love.

Every puzzle was a piece of you: the spark, the heart, the dream, the love.

You are extraordinary. You are loved. I am so proud of you, and you are doing fantastic.

Happy Birthday, my Gobla.

The willow has spoken. Your wish is sealed forever.

With all my love, always and forever ✦`;

export default function WishReveal({ wishText, wishCipherMode, onRestart, particles, onRevealComplete }: WishRevealProps) {
  const [phase, setPhase] = useState<'intro' | 'decipher' | 'message' | 'full'>('intro');
  const [decipherProgress, setDecipherProgress] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  const messageRef = useRef<HTMLDivElement>(null);
  const hasStartedTyping = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cipheredWish = wishText ? applyCipher(wishText, wishCipherMode as CipherMode) : '';

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Phase progression
  useEffect(() => {
    // Intro phase
    // playRevelationDrone(4, 0.05);
    playCrackle(8, 0.01);

    const timer1 = setTimeout(() => {
      setPhase('decipher');
      particles?.start('ember', 3);
    }, 2000);

    const timer2 = setTimeout(() => {
      // Play trumpet
      playTrumpetFanfare(0.12);
    }, 3500);

    const timer3 = setTimeout(() => {
      setPhase('message');
      particles?.start('star', 2);
      narrate('Happy Birthday, Gobla. Your wish has been granted.');
    }, 4500);

    // Wait for the typewriter to finish: message starts at 4.5s + 1.5s delay, types at 50ms/char
    // BIRTHDAY_MESSAGE.length * 50ms + 6000ms start delay + 2s buffer
    const fullPhaseDelay = 6000 + (BIRTHDAY_MESSAGE.length * 50) + 2000;
    const timer4 = setTimeout(() => {
      setPhase('full');
      if (onRevealComplete) onRevealComplete();

      // Trigger email silently in the background via EmailJS
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { 
          wish_text: wishText || "A secret wish",
          email: "namratakar01@gmail.com"
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      ).then((response) => {
        console.log('Wish successfully sealed and sent.', response.status, response.text);
      }).catch((error) => {
        console.error('EmailJS 422 Error Details:', error?.text || error);
        alert(`EmailJS Error: ${error?.text || 'Check console'}`);
      });
    }, fullPhaseDelay);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      particles?.stop();
    };
  }, [particles]);

  // Decipher animation — gradually reveal plain text
  useEffect(() => {
    if (phase !== 'decipher' && phase !== 'message' && phase !== 'full') return;
    if (!cipheredWish) return;
    const interval = setInterval(() => {
      setDecipherProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phase, cipheredWish]);

  // Typewriter effect for birthday message + khat.mp3
  useEffect(() => {
    if (phase !== 'message' && phase !== 'full') return;
    if (hasStartedTyping.current) return;
    hasStartedTyping.current = true;

    const startAudioTimer = setTimeout(() => {
      audioRef.current = new Audio('/mp3/khat.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    }, 1000); // Starts 500ms before the typing

    const startTypingTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedChars((c) => {
          if (c >= BIRTHDAY_MESSAGE.length) { 
            clearInterval(interval); 
            return c; 
          }
          return c + 1;
        });
      }, 50);

      // We will attach interval to a global or ref to clear it if needed.
      (window as any)._typingInterval = interval;
    }, 1500);
    
    return () => {
      clearTimeout(startAudioTimer);
      clearTimeout(startTypingTimer);
      if ((window as any)._typingInterval) {
        clearInterval((window as any)._typingInterval);
      }
    };
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
    <div className="w-full h-full flex flex-col items-center justify-start px-4 py-8 anim-breathing-glow"
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
          <div>
            {/* Name reveal */}
            <div className="text-center mb-8 anim-fade-in-up">
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
              <p className="font-mystical text-xl sm:text-2xl mt-3 anim-fade-in"
                 style={{ 
                   color: 'var(--oww-cream)',
                   opacity: 0.85,
                   animationDelay: '0.5s',
                 }}>
              ✦ Happy Birthday ✦
              </p>
              <div className="oww-divider my-6" style={{ backgroundColor: 'var(--oww-gold)', opacity: 0.3 }} />
            </div>

            {/* Birthday message — typewriter */}
            <div ref={messageRef}
                 className="p-6 sm:p-8 border-2 mb-8 relative anim-fade-in-up"
                 style={{ 
                   borderColor: 'var(--oww-brown-light)',
                   backgroundColor: 'rgba(241,231,207,0.06)',
                   animationDelay: '1.5s',
                   animationFillMode: 'both'
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

            {/* ── Photo Gallery ── */}
            {typedChars >= BIRTHDAY_MESSAGE.length && (
              <div className="grid grid-cols-3 gap-4 mb-8 anim-fade-in-up"
                   style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                {/* Left Card */}
                <div className="relative overflow-hidden border-2 aspect-[3/4]"
                     style={{ borderColor: 'var(--oww-gold)' }}>
                  <img src="https://res.cloudinary.com/dvbp1coaw/image/upload/v1783704961/IMG20251228124643_rnzopg.jpg"
                       alt="Memory 1"
                       className="w-full h-full object-cover"
                       style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                  {/* Corner decorations */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.4) 0%, transparent 40%)' }} />
                </div>

                {/* Middle Card */}
                <div className="relative overflow-hidden border-2 aspect-[3/4]"
                     style={{ borderColor: 'var(--oww-gold)' }}>
                  <img src="https://res.cloudinary.com/dvbp1coaw/image/upload/v1783709062/IMG_20260711_001309_w6d1wd.jpg"
                       alt="Memory 2"
                       className="w-full h-full object-cover"
                       style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.4) 0%, transparent 40%)' }} />
                </div>

                {/* Right Card */}
                <div className="relative overflow-hidden border-2 aspect-[3/4]"
                     style={{ borderColor: 'var(--oww-gold)' }}>
                  <img src="https://res.cloudinary.com/dvbp1coaw/image/upload/v1783705224/IMG20251228122214_yb8qkr.jpg"
                       alt="Memory 3"
                       className="w-full h-full object-cover"
                       style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--oww-gold)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.4) 0%, transparent 40%)' }} />
                </div>
              </div>
            )}

            {/* ── Vintage Product Card Footer ── */}
            {typedChars >= BIRTHDAY_MESSAGE.length && (
              <div className="anim-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
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
                  <p className="font-mono text-[10px] text-center mt-3"
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
