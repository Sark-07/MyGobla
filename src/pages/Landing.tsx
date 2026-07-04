// ══════════════════════════════════════════════════
// Stage 0: LANDING — "A Package Has Arrived"
// Retro product page inspired by onewishwillow.com
// ══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { playCrackle, playSparkPop } from '../lib/sfx';
import { whisper } from '../lib/voice';
import type { ParticleSystem } from '../lib/particles';

interface LandingProps {
  onStart: () => void;
  initAudio: () => void;
  particles: ParticleSystem | null;
}

export default function Landing({ onStart, initAudio, particles }: LandingProps) {
  const [entered, setEntered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (entered && particles) {
      particles.start('star', 1);
      return () => particles.stop();
    }
  }, [entered, particles]);

  const handleEnter = () => {
    initAudio();
    setEntered(true);
    playCrackle(2, 0.15);
    setTimeout(() => {
      setShowContent(true);
      whisper('Gobla... a package has arrived for you...');
    }, 600);
  };

  // Initial "click to enter" gate (required for audio)
  if (!entered) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-4"
           style={{ backgroundColor: 'var(--oww-black)' }}>
        <div className="text-center stagger">
          {/* Stars decoration */}
          <p className="text-[var(--oww-gold)] text-sm tracking-[1em] mb-8 anim-pulse-gold">
            ✦ ✦ ✦
          </p>

          {/* Title */}
          <h1 className="font-display text-[var(--oww-cream)] oww-title-xl mb-4">
            ONE WISH
            <br />
            <span className="text-[var(--oww-red)]">WILLOW</span>
          </h1>

          {/* Tagline */}
          <p className="font-mono text-[var(--oww-cream-dark)] text-xs tracking-[0.2em] uppercase mb-12 max-w-xs mx-auto leading-relaxed">
            100% magical · 0% real<br/>
            A birthday mystery awaits
          </p>

          {/* Enter button */}
          <button 
            onClick={handleEnter}
            className="group relative font-mono text-sm font-bold tracking-[0.12em] uppercase
                       px-10 py-4 border-2 border-[var(--oww-red)] text-[var(--oww-red)]
                       bg-transparent transition-all duration-300
                       hover:bg-[var(--oww-red)] hover:text-[var(--oww-cream)]
                       hover:shadow-[0_0_30px_rgba(196,30,58,0.3)]"
          >
            <span className="relative z-10">Enter ✦</span>
          </button>

          {/* Bottom warning */}
          <p className="font-mono text-[var(--oww-brown-light)] text-[10px] tracking-[0.15em] uppercase mt-12 opacity-60">
            ⚠ This wish is irreversible ⚠
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-12"
         style={{ backgroundColor: 'var(--oww-cream)' }}>
      
      {showContent && (
        <div className="max-w-lg w-full anim-fade-in-up">
          
          {/* ── Product Card ── */}
          <div className="oww-card">
            {/* Top label */}
            <div className="flex items-center justify-between mb-6">
              <span className="oww-tag">EST. 2026</span>
              <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{ color: 'var(--oww-brown-light)' }}>
                ITEM NO. 001
              </span>
            </div>

            {/* Title */}
            <h1 className="oww-title-xl text-center mb-2" style={{ color: 'var(--oww-black)' }}>
              ONE WISH
              <br />
              <span style={{ color: 'var(--oww-red)' }}>WILLOW</span>
            </h1>

            {/* Stars */}
            <p className="text-center text-[var(--oww-gold)] text-xs tracking-[0.8em] mb-6">
              ★ ★ ★ ★ ★
            </p>

            {/* Divider */}
            <div className="oww-divider mb-6" />

            {/* Product description */}
            <div className="space-y-4 mb-8">
              <p className="font-display text-base text-center italic"
                 style={{ color: 'var(--oww-brown)' }}>
                "Remove from the box and just make a wish!"
              </p>

              {/* Instructions box */}
              <div className="border-2 border-dashed p-4 space-y-3"
                   style={{ borderColor: 'var(--oww-brown-light)' }}>
                <p className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-center"
                   style={{ color: 'var(--oww-red)' }}>
                  ✦ INSTRUCTIONS ✦
                </p>
                <div className="space-y-2 font-mono text-xs"
                     style={{ color: 'var(--oww-brown)' }}>
                  <p><span className="inline-block w-4 text-center font-bold" style={{ color: 'var(--oww-red)' }}>1.</span> Remove from the box</p>
                  <p><span className="inline-block w-4 text-center font-bold" style={{ color: 'var(--oww-red)' }}>2.</span> Make a wish</p>
                  <p><span className="inline-block w-4 text-center font-bold" style={{ color: 'var(--oww-red)' }}>3.</span> Spark the middle and break it in half</p>
                </div>
              </div>

              {/* Price tag */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="text-center">
                  <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                     style={{ color: 'var(--oww-brown-light)' }}>PRICE</p>
                  <p className="font-display text-lg font-bold line-through"
                     style={{ color: 'var(--oww-brown-light)' }}>∞ WISHES</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                     style={{ color: 'var(--oww-red)' }}>SALE</p>
                  <p className="font-display text-2xl font-black"
                     style={{ color: 'var(--oww-red)' }}>1 WISH</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="oww-divider mb-6" />

            {/* Personalized message */}
            <div className="text-center mb-8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                 style={{ color: 'var(--oww-brown-light)' }}>
                THIS PACKAGE IS ADDRESSED TO
              </p>
              <p className="font-mystical text-3xl font-bold anim-pulse-gold"
                 style={{ color: 'var(--oww-gold)' }}>
                Gobla
              </p>
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase mt-2"
                 style={{ color: 'var(--oww-brown-light)' }}>
                ⚠ SINGLE USE ONLY · IRREVERSIBLE ⚠
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => { playSparkPop(); onStart(); }}
              className="w-full font-mono text-sm font-bold tracking-[0.12em] uppercase
                         px-6 py-4 border-2 border-[var(--oww-red)] 
                         bg-[var(--oww-red)] text-[var(--oww-cream)]
                         transition-all duration-300
                         hover:bg-[var(--oww-cream)] hover:text-[var(--oww-red)]
                         hover:shadow-[4px_4px_0_var(--oww-black)]
                         active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Open The Box →
            </button>

            {/* Bottom stamps */}
            <div className="flex items-center justify-between mt-6 pt-4"
                 style={{ borderTop: '1px dashed var(--oww-brown-light)' }}>
              <span className="oww-stamp text-[10px] py-1 px-2"
                    style={{ color: 'var(--oww-red)', borderColor: 'var(--oww-red)', transform: 'rotate(-6deg)' }}>
                TOP SECRET
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--oww-brown-light)' }}>
                WISH #0001
              </span>
              <span className="oww-stamp text-[10px] py-1 px-2"
                    style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(4deg)' }}>
                GENUINE
              </span>
            </div>
          </div>

          {/* Footer warning */}
          <p className="text-center font-mono text-[10px] tracking-[0.1em] mt-6"
             style={{ color: 'var(--oww-brown-light)' }}>
            ONE WISH WILLOW™ · NOT RESPONSIBLE FOR WISHES GRANTED
          </p>
        </div>
      )}
    </div>
  );
}
