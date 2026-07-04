import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useGameState();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  
  // Do not show sidebars on these specific pages
  const hideSidebars = isLanding || location.pathname === '/stars' || location.pathname === '/reveal';

  const isRevealed = state.completedLevels.includes(5);

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ backgroundColor: 'var(--oww-cream)' }}>
      {/* Main Container */}
      <div className="w-full max-w-[1600px] flex flex-col md:flex-row relative z-10"
           style={{ borderLeft: hideSidebars ? 'none' : '2px solid var(--oww-black)', borderRight: hideSidebars ? 'none' : '2px solid var(--oww-black)' }}>
        
        {/* LEFT COLUMN */}
        {!hideSidebars && (
          <aside className="hidden md:flex flex-col w-[280px] lg:w-[320px] flex-shrink-0"
                 style={{ borderRight: '2px solid var(--oww-black)', backgroundColor: 'var(--oww-cream-light)' }}>
            <div className="p-4 border-b-2" style={{ borderColor: 'var(--oww-black)' }}>
              <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-4"
                 style={{ color: 'var(--oww-brown-light)' }}>
                THE WILLOW'S CHRONICLE · SACRED ARCHIVE
              </p>
              
              {/* Image Placeholder */}
              <div className="w-full aspect-[3/4] border-2 relative overflow-hidden mb-6 group"
                   style={{ borderColor: 'var(--oww-black)', backgroundColor: 'var(--oww-black)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl mb-4 anim-pulse-gold" style={{ color: 'var(--oww-gold)' }}>✦</span>
                  <p className="font-mono text-[10px] tracking-[0.1em] uppercase"
                     style={{ color: 'var(--oww-brown-light)' }}>
                    AWAITING SOUL IMPRINT
                  </p>
                </div>
                
                {/* Decorative photo corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 m-2" style={{ borderColor: 'var(--oww-brown-light)' }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 m-2" style={{ borderColor: 'var(--oww-brown-light)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 m-2" style={{ borderColor: 'var(--oww-brown-light)' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 m-2" style={{ borderColor: 'var(--oww-brown-light)' }} />
                
                {/* Glitch overlay line */}
                <div className="absolute left-0 right-0 h-[2px] bg-white opacity-20"
                     style={{ top: '50%', animation: 'scanline 8s linear infinite' }} />
              </div>

              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-center mb-2"
                 style={{ color: 'var(--oww-red)' }}>
                RECORD I — AURA MANIFESTATION — SOUL #0042
              </p>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 font-mono text-[10px] tracking-[0.1em] uppercase"
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
                <span>RITUAL DATE:</span>
                <span className="font-bold">MAY 2026</span>
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

              <div className="mt-auto pt-6 flex justify-center opacity-60">
                <span className="oww-stamp text-[12px] py-1 px-3"
                      style={{ color: 'var(--oww-red)', borderColor: 'var(--oww-red)', transform: 'rotate(-5deg)' }}>
                  ETERNAL BOND
                </span>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER COLUMN */}
        <main className="flex-1 flex flex-col relative min-w-0" style={{ backgroundColor: 'var(--oww-cream)' }}>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {children}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN */}
        {!hideSidebars && (
          <aside className="hidden lg:flex flex-col w-[280px] xl:w-[320px] flex-shrink-0"
                 style={{ borderLeft: '2px solid var(--oww-black)', backgroundColor: 'var(--oww-cream-light)' }}>
            <div className="p-6">
              <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-8 pb-4 border-b-2"
                 style={{ color: 'var(--oww-brown-light)', borderColor: 'var(--oww-black)' }}>
                READ THE ANCIENT RUNES →
              </p>
              
              <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-8 pb-4 border-b-2"
                 style={{ color: 'var(--oww-brown-light)', borderColor: 'var(--oww-black)' }}>
                THE WILLOW'S PRICE →
              </p>

              <div className="mb-8">
                <p className="font-mono text-[11px] font-bold tracking-[0.15em] uppercase mb-4 pb-2 border-b-2"
                   style={{ color: 'var(--oww-black)', borderColor: 'var(--oww-black)' }}>
                  MAGICAL AFFINITIES
                </p>
                
                <div className="space-y-4 font-mono text-[10px] tracking-[0.1em] uppercase">
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>SOUL RESONANCE</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>HARMONIC</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>WISH CAPACITY</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>SINGULAR</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>MAGIC THREADS</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>WOVEN</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>CELESTIAL ALIGNMENT</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>TRUE</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>DREAM RETENTION</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>PERFECT</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>CLASSIFICATION</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>SACRED / BOUND</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <span className="oww-stamp text-[10px] py-1 px-2 opacity-80"
                      style={{ color: 'var(--oww-gold)', borderColor: 'var(--oww-gold)', transform: 'rotate(2deg)' }}>
                  AURA LEVEL 10000++
                </span>
              </div>

              <div className="pt-8 border-t-2" style={{ borderColor: 'var(--oww-black)' }}>
                <p className="font-mono text-[11px] font-bold tracking-[0.15em] uppercase mb-4"
                   style={{ color: 'var(--oww-black)' }}>
                  ETERNAL CONNECTIONS
                </p>
                
                <div className="space-y-4 font-mono text-[10px] tracking-[0.1em] uppercase">
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>HEARTBEAT</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>SYNCED →</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>MEMORIES</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>CHERISHED →</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--oww-brown-light)' }}>DESTINY</p>
                    <p className="font-bold" style={{ color: 'var(--oww-black)' }}>SEALED →</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
