// ══════════════════════════════════════════════════
// Stage 4: WISH CIPHER MACHINE — "Break It In Half"
// Live wish cipher — type wish, see it encrypted
// ══════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { applyCipher, CIPHER_MODES, type CipherMode } from '../lib/ciphers';
import { playCipherTick, playSnap, playWoodCreak, playRadioTune, playRevelationDrone } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface WishCipherProps {
  onComplete: (wishText: string, cipherMode: string) => void;
  particles: ParticleSystem | null;
}

export default function WishCipher({ onComplete, particles }: WishCipherProps) {
  const [wish, setWish] = useState('');
  const [cipherMode, setCipherMode] = useState<CipherMode>('caesar');
  const [sealed, setSealed] = useState(false);
  const [cracking, setCracking] = useState(false);

  const cipheredText = wish ? applyCipher(wish, cipherMode) : '';

  useEffect(() => {
    whisper('Speak your wish into the machine, Gobla... let the willow hear you...');
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (sealed) return;
    setWish(e.target.value);
    if (e.target.value.length > wish.length) playCipherTick(0.08);
  }, [sealed, wish.length]);

  const handleModeChange = useCallback((mode: CipherMode) => {
    if (sealed) return;
    setCipherMode(mode);
    playRadioTune(0.6, 0.06);
  }, [sealed]);

  const handleSeal = useCallback(() => {
    if (!wish.trim() || sealed) return;
    setSealed(true);
    playWoodCreak(1.5, 0.12);
    
    setTimeout(() => {
      setCracking(true);
      playSnap(0.3);
      playRevelationDrone(3, 0.06);
      particles?.burst(window.innerWidth / 2, window.innerHeight / 2, 60, 'spark');
      
      setTimeout(() => {
        onComplete(wish, cipherMode);
      }, 2000);
    }, 1200);
  }, [wish, sealed, cipherMode, onComplete, particles]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 transition-colors duration-1000 ${
      cracking ? 'bg-[var(--oww-black)]' : ''
    }`}
         style={{ backgroundColor: cracking ? undefined : 'var(--oww-cream)' }}>

      {/* Crack overlay */}
      {cracking && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          <div className="flex-1 bg-[var(--oww-cream)]"
               style={{ animation: 'crack-left 1.5s cubic-bezier(0.22,1,0.36,1) forwards' }} />
          <div className="w-1 flex-shrink-0"
               style={{ 
                 backgroundColor: 'var(--oww-gold-bright)',
                 boxShadow: '0 0 40px var(--oww-gold), 0 0 80px var(--oww-gold)',
                 animation: 'crack-glow 1.5s ease-out forwards',
               }} />
          <div className="flex-1 bg-[var(--oww-cream)]"
               style={{ animation: 'crack-right 1.5s cubic-bezier(0.22,1,0.36,1) forwards' }} />
        </div>
      )}
      
      {!cracking && (
        <div className={`max-w-2xl w-full ${sealed ? 'opacity-60 pointer-events-none' : ''}`}>
          {/* Header */}
          <div className="text-center mb-8 stagger">
            <span className="oww-tag mb-4 inline-block">LEVEL IV</span>
            <h2 className="oww-title-lg mb-2" style={{ color: 'var(--oww-black)' }}>
              Break It In <span style={{ color: 'var(--oww-red)' }}>Half</span>
            </h2>
            <p className="font-mono text-xs tracking-[0.1em] uppercase"
               style={{ color: 'var(--oww-brown-light)' }}>
              Type your wish · Watch it transform · Seal it forever
            </p>
          </div>

          {/* ── Cipher Machine ── */}
          <div className="oww-card relative overflow-hidden">
            {/* Machine header */}
            <div className="flex items-center justify-between mb-6 pb-4"
                 style={{ borderBottom: '2px solid var(--oww-black)' }}>
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
                   style={{ color: 'var(--oww-red)' }}>
                  ✦ CIPHER MACHINE ✦
                </p>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase mt-0.5"
                   style={{ color: 'var(--oww-brown-light)' }}>
                  MODEL OWW-1 · PATENT PENDING
                </p>
              </div>
              <div className="oww-stamp text-[8px] py-0.5 px-2"
                   style={{ color: 'var(--oww-red)', borderColor: 'var(--oww-red)', transform: 'rotate(3deg)' }}>
                FOR GOBLA
              </div>
            </div>

            {/* Cipher mode selector */}
            <div className="mb-6">
              <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase mb-3"
                 style={{ color: 'var(--oww-brown-light)' }}>
                CIPHER MODE:
              </p>
              <div className="flex flex-wrap gap-2">
                {CIPHER_MODES.map((mode) => (
                  <button key={mode.id}
                          onClick={() => handleModeChange(mode.id)}
                          className={`
                            font-mono text-[11px] font-bold tracking-[0.06em] uppercase
                            px-3 py-2 border-2 transition-all duration-200
                            ${cipherMode === mode.id
                              ? 'border-[var(--oww-red)] bg-[var(--oww-red)] text-[var(--oww-cream)]'
                              : 'border-[var(--oww-brown-light)] text-[var(--oww-brown-light)] hover:border-[var(--oww-black)] hover:text-[var(--oww-black)]'}
                          `}>
                    <span className="mr-1.5">{mode.symbol}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="mb-6">
              <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase mb-2"
                 style={{ color: 'var(--oww-brown-light)' }}>
                YOUR WISH:
              </p>
              <textarea
                value={wish}
                onChange={handleInput}
                placeholder="Type your birthday wish here, Gobla..."
                rows={3}
                maxLength={200}
                className="w-full font-mono text-sm font-bold tracking-[0.04em]
                           px-4 py-3 border-2 bg-[var(--oww-cream-light)] outline-none resize-none
                           transition-colors focus:border-[var(--oww-red)]"
                style={{ 
                  WebkitTextSecurity: 'disc',
                  borderColor: 'var(--oww-brown-light)', 
                  color: 'var(--oww-black)' 
                } as any}
              />
              <p className="font-mono text-[10px] text-right mt-1"
                 style={{ color: 'var(--oww-brown-light)' }}>
                {wish.length} / 200
              </p>
            </div>

            {/* Divider with label */}
            <div className="relative my-6">
              <div className="w-full h-0.5" style={{ backgroundColor: 'var(--oww-brown-light)' }} />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{ backgroundColor: 'var(--oww-cream-light)', color: 'var(--oww-red)' }}>
                ENCRYPTED OUTPUT
              </span>
            </div>

            {/* Ciphered output */}
            <div className="mb-6">
              <div className="p-4 border-2 min-h-[80px] relative"
                   style={{ 
                     borderColor: 'var(--oww-black)', 
                     backgroundColor: 'var(--oww-cream-dark)',
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(58,42,26,0.08) 23px, rgba(58,42,26,0.08) 24px)',
                   }}>
                {cipheredText ? (
                  <p className={`font-mono text-sm font-bold tracking-[0.08em] break-all leading-relaxed ${
                    cipherMode === 'runic' ? 'text-lg tracking-[0.2em]' : ''
                  }`}
                     style={{ color: 'var(--oww-red)' }}>
                    {cipheredText}
                  </p>
                ) : (
                  <p className="font-mono text-sm italic"
                     style={{ color: 'var(--oww-brown-light)' }}>
                    Your ciphered wish will appear here...
                  </p>
                )}

                {/* Paper tape decoration */}
                <div className="absolute top-0 right-0 w-6 h-6 border-l-2 border-b-2"
                     style={{ borderColor: 'var(--oww-brown-light)', backgroundColor: 'var(--oww-cream)' }} />
              </div>

              {/* Mode indicator */}
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase"
                      style={{ color: 'var(--oww-brown-light)' }}>
                  MODE: {CIPHER_MODES.find((m) => m.id === cipherMode)?.label}
                </span>
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase"
                      style={{ color: 'var(--oww-brown-light)' }}>
                  CHARS: {cipheredText.length}
                </span>
              </div>
            </div>

            {/* Seal button */}
            <button onClick={handleSeal}
                    disabled={!wish.trim()}
                    className={`
                      w-full font-mono text-sm font-bold tracking-[0.12em] uppercase
                      px-6 py-4 border-2 transition-all duration-300
                      ${wish.trim()
                        ? 'border-[var(--oww-red)] bg-[var(--oww-red)] text-[var(--oww-cream)] hover:bg-[var(--oww-cream)] hover:text-[var(--oww-red)] hover:shadow-[4px_4px_0_var(--oww-black)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer'
                        : 'border-[var(--oww-brown-light)] bg-[var(--oww-cream-dark)] text-[var(--oww-brown-light)] cursor-not-allowed'}
                    `}>
              {wish.trim() ? '⊛ SEAL THE WISH ⊛' : 'TYPE YOUR WISH FIRST...'}
            </button>

            {/* Warning */}
            <p className="font-mono text-[10px] text-center mt-4 tracking-[0.08em]"
               style={{ color: 'var(--oww-brown-light)' }}>
              ⚠ ONCE SEALED, THIS WISH CANNOT BE CHANGED ⚠
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
