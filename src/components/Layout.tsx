import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { CAROUSEL_IMAGES } from '../constants/images';
import { useGameState } from '../hooks/useGameState';

interface LayoutProps {
  children: ReactNode;
}

const ROUTE_DATA: Record<string, { title: string, verse: string, resonance: number }> = {
  '/': { title: 'THE ARRIVAL', verse: 'A soul arrives, seeking the willow’s blessing...', resonance: 0 },
  '/cipher': { title: 'THE VEILED TRUTH', verse: 'Life shifts in unexpected ways. Turn the wheel to uncover the truth hidden beneath.', resonance: 20 },
  '/memory': { title: 'ECHOES OF TIME', verse: 'Fragments of the past align. Memories merge into one.', resonance: 40 },
  '/chain': { title: 'THE BINDING', verse: 'The chain of fate. Ignite the branches with your words.', resonance: 60 },
  '/stars': { title: 'CONSTELLATIONS', verse: 'The stars hold secrets written in the dark.', resonance: 80 },
  '/wish-machine': { title: 'THE OFFERING', verse: 'The final trial. Speak your heart into the void.', resonance: 99 },
  '/reveal': { title: 'THE AWAKENING', verse: 'The willow has spoken. Your wish is sealed forever.', resonance: 100 },
};

export function Layout({ children }: LayoutProps) {
  const { state } = useGameState();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const isLanding = location.pathname === '/';
  const hideSidebars = isLanding || location.pathname === '/stars' || location.pathname === '/reveal';
  
  const currentData = ROUTE_DATA[location.pathname] || ROUTE_DATA['/'];
  const isRevealed = state.completedLevels.includes(5);

  return (
    <div className="flex-1 h-full w-full flex justify-center transition-colors duration-1000" style={{ backgroundColor: 'var(--oww-cream)' }}>
      {/* Main Container - Removed rigid borders, added subtle shadow and soft edges */}
      <div className="w-full max-w-screen flex flex-col md:flex-row relative z-10 mx-auto max-w-[1600px]">
        
        {/* LEFT COLUMN: THE CHRONICLE */}
        {!hideSidebars && (
          <aside className="hidden md:flex flex-col w-[280px] lg:w-[320px] flex-shrink-0 px-6 py-12 anim-fade-in"
                 style={{ borderRight: '1px dashed rgba(139, 69, 19, 0.2)' }}>
            
            <div className="mb-12">
              <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                 style={{ color: 'var(--oww-brown-light)' }}>
                THE CHRONICLE OF GOBLA
              </p>
              
              {/* Photo Carousel (Aura Imprint) */}
              <div className="w-full aspect-[3/4] relative overflow-hidden mb-6 group rounded-sm"
                   style={{ backgroundColor: 'var(--oww-black)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)' }}>
                {CAROUSEL_IMAGES.map((src, idx) => (
                  <img 
                    key={idx}
                    src={src}
                    alt="Memory"
                    loading={idx === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIdx ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      filter: 'sepia(0.6) contrast(1.1) brightness(0.85) hue-rotate(-5deg)',
                    }}
                  />
                ))}
                
                {/* Theme overlays */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'var(--oww-gold)', opacity: 0.1, mixBlendMode: 'color' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--oww-black)] via-transparent to-[var(--oww-black)] opacity-60 pointer-events-none"></div>
                
                {/* Mystical soft glow based on progress */}
                <div className="absolute inset-0 opacity-30 transition-opacity duration-1000"
                     style={{ 
                       background: `radial-gradient(circle at center, var(--oww-gold) 0%, transparent ${currentData.resonance}%)` 
                     }} />
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--oww-brown-light)' }}>
                  CHAPTER
                </span>
                <span className="font-mono text-[9px] font-bold tracking-[0.2em]" style={{ color: 'var(--oww-black)' }}>
                  {currentData.title}
                </span>
              </div>
            </div>

            {/* Dynamic Poetry */}
            <div className="flex-1 flex flex-col justify-start">
              <div className="relative pl-4 border-l border-dotted" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span className="absolute -left-[5px] top-0 text-[10px]" style={{ color: 'var(--oww-gold)' }}>✦</span>
                <p className="font-display text-lg italic leading-relaxed transition-all duration-700"
                   style={{ color: 'var(--oww-black)' }}>
                  "{currentData.verse}"
                </p>
              </div>
            </div>

            <div className="mt-auto pt-6 flex justify-center opacity-70">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: 'var(--oww-brown-light)' }}>
                • DESTINY WOVEN •
              </span>
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: THE PUZZLE */}
        <main className="flex-1 flex flex-col relative min-w-0">
          <div ref={scrollRef} className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {children}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: RESONANCE METRICS */}
        {!hideSidebars && (
          <aside className="hidden lg:flex flex-col w-[280px] xl:w-[320px] flex-shrink-0 px-6 py-12 anim-fade-in"
                 style={{ borderLeft: '1px dashed rgba(139, 69, 19, 0.2)' }}>
            
            <div className="mb-8">
              <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-4 pb-2 border-b border-dotted text-right pr-2"
                 style={{ color: 'var(--oww-brown-light)', borderColor: 'var(--oww-brown-light)' }}>
                THE PATH TO AWAKENING ✦
              </p>
              
              <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-4 pb-2 border-b border-dotted text-right pr-2"
                 style={{ color: 'var(--oww-brown-light)', borderColor: 'var(--oww-brown-light)' }}>
                THE WILLOW'S PROMISE ✦
              </p>

              <>
                <p
                  className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-4 pb-2 border-b border-dotted text-right pr-2"
                  style={{ color: 'var(--oww-brown-light)', borderColor: 'var(--oww-brown-light)' }}
                  onClick={() => setJourneyModalOpen(true)}
                  title="Watch The Journey"
                >
                  <span className="journey-text">THE JOURNEY ✦</span>
                </p>

                {journeyModalOpen && (
                  <div
                    className="journey-modal-backdrop fixed inset-0 z-[10000] flex items-center justify-center bg-[rgba(10,6,3,0.96)]"
                    onClick={(e) => { if (e.target === e.currentTarget) { videoRef.current?.pause(); setJourneyModalOpen(false); } }}
                  >
                    <div className="journey-modal-card relative rounded-2xl p-6 w-[90vw] max-w-[820px]">
                      <button
                        className="jm-close-x absolute top-3 right-4 bg-transparent border-none text-[rgba(212,175,55,0.5)] text-xl cursor-pointer leading-none transition-colors duration-200"
                        onClick={() => { videoRef.current?.pause(); setJourneyModalOpen(false); }}
                        aria-label="Close"
                      >✕</button>
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-center mb-4 text-[rgba(212,175,55,0.7)]">
                        ✦ &nbsp; THE JOURNEY &nbsp; ✦
                      </p>
                      <div className="journey-video-wrapper relative w-full rounded-[10px] overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          src="/mp4/lapata-2.mp4"
                          preload="auto"
                          controls={false}
                          autoPlay
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full block object-contain rounded-[10px]"
                          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-3.5 mt-5">
                        <button
                          className="jm-btn jm-btn-play font-mono text-[10px] tracking-[0.18em] uppercase border border-solid rounded-lg px-5 py-2 cursor-pointer bg-transparent outline-none"
                          onClick={() => { const v = videoRef.current; if (!v) return; v.paused ? v.play() : v.pause(); }}
                        >
                          ▶ &nbsp; Play / Pause
                        </button>
                        <button
                          className="jm-btn jm-btn-mute font-mono text-[10px] tracking-[0.18em] uppercase border border-solid rounded-lg px-5 py-2 cursor-pointer bg-transparent outline-none"
                          onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; }}
                        >
                          🔊 &nbsp; Mute / Unmute
                        </button>
                        <button
                          className="jm-btn jm-btn-close font-mono text-[10px] tracking-[0.18em] uppercase border border-solid rounded-lg px-5 py-2 cursor-pointer bg-transparent outline-none"
                          onClick={() => { videoRef.current?.pause(); setJourneyModalOpen(false); }}
                        >
                          ✕ &nbsp; Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>

            <div className="mb-12 text-right">
              <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
                 style={{ color: 'var(--oww-brown-light)' }}>
                SOUL RESONANCE
              </p>
              <div className="font-display text-5xl transition-all duration-1000"
                   style={{ color: currentData.resonance === 100 ? 'var(--oww-gold)' : 'var(--oww-black)' }}>
                {currentData.resonance}%
              </div>
            </div>

            <div className="mb-12 flex flex-col gap-4 font-mono text-[10px] tracking-[0.1em] uppercase"
                 style={{ color: 'var(--oww-brown)' }}>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>DESTINY · REF:</span>
                <span className="font-bold">OWW-0042</span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>WISH MAKER:</span>
                <span className="font-bold">GOBLA</span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>SOUL INCEPTION:</span>
                <span className="font-bold">18 JULY 2001</span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>RITUAL DATE:</span>
                <span className="font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>THE WILLOW:</span>
                <span className="font-bold" style={{ color: 'var(--oww-black)' }}>LISTENING</span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>STATUS:</span>
                <span className="font-bold" style={{ color: isRevealed ? 'var(--oww-gold)' : 'var(--oww-red)' }}>
                  {isRevealed ? 'GRANTED' : 'AWAKENING'}
                </span>
              </div>
              <div className="flex justify-between border-b border-dotted pb-2 items-center" style={{ borderColor: 'var(--oww-brown-light)' }}>
                <span>CLEARANCE:</span>
                <span className="px-2 py-0.5 bg-[var(--oww-black)] text-[var(--oww-cream)] font-bold">
                  MYSTICAL
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-right"
                 style={{ color: 'var(--oww-red)' }}>
                RECORD I — AURA MANIFESTATION — SOUL #0042
              </p>
            </div>

            <div className="mb-8 flex justify-end gap-4">
              <span className="oww-stamp text-[10px] py-1 px-2 opacity-60"
                    style={{ color: 'var(--oww-red)', borderColor: 'var(--oww-red)', transform: 'rotate(-5deg)' }}>
                ETERNAL BOND
              </span>
              <span className="oww-stamp text-[10px] py-1 px-2 opacity-80"
                    style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(2deg)' }}>
                AURA LEVEL 10000++
              </span>
            </div>

            <div className="mt-auto pt-8 border-t border-dotted" style={{ borderColor: 'var(--oww-brown-light)' }}>
              <p className="font-display text-sm italic text-right leading-relaxed"
                 style={{ color: 'var(--oww-brown)' }}>
                "In every puzzle, a piece of your spirit is reflected back to the world."
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
