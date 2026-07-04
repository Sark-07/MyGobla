// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Progress Bar Component
// 6 puzzle levels + final reveal
// ══════════════════════════════════════════════════

import { useMemo } from 'react';

const LEVEL_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const LEVEL_NAMES = ['CIPHER', 'MEMORY', 'WORDS', 'STARS', 'WISH', 'REVEAL'];

interface ProgressBarProps {
  currentLevel: number;
  completedLevels: number[];
}

export function ProgressBar({ currentLevel, completedLevels }: ProgressBarProps) {
  const dots = useMemo(() =>
    LEVEL_LABELS.map((label, i) => {
      const isCompleted = completedLevels.includes(i);
      const isCurrent = i === currentLevel;
      return { label, isCompleted, isCurrent, index: i, name: LEVEL_NAMES[i] || '' };
    }),
    [currentLevel, completedLevels]
  );

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-1 py-2 px-4 w-full"
         style={{ backgroundColor: 'var(--oww-cream-dark)', borderBottom: '2px solid var(--oww-black)' }}>
      {/* Left label */}
      <span className="hidden sm:inline font-mono text-[9px] font-bold tracking-[0.12em] uppercase mr-2"
            style={{ color: 'var(--oww-brown-light)' }}>
        OWW
      </span>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {dots.map((dot, i) => (
          <div key={i} className="flex items-center gap-0.5 sm:gap-1">
            {/* Dot */}
            <div className="flex flex-col items-center">
              <div className={`
                relative flex items-center justify-center transition-all duration-500
                font-mono text-[9px] font-bold
                w-6 h-6 sm:w-7 sm:h-7
                ${dot.isCompleted 
                  ? 'border-[var(--oww-gold)] bg-[var(--oww-gold)] text-[var(--oww-black)] border-2' 
                  : dot.isCurrent 
                    ? 'border-[var(--oww-red)] bg-transparent text-[var(--oww-red)] border-2 anim-pulse-ember' 
                    : 'border-[var(--oww-brown-light)] bg-transparent text-[var(--oww-brown-light)] border'}
              `}>
                {dot.isCompleted ? '✓' : dot.label}
              </div>
              {/* Level name below (hidden on mobile) */}
              {dot.name && (
                <span className="hidden lg:block font-mono text-[7px] tracking-[0.08em] mt-0.5 uppercase"
                      style={{ color: dot.isCompleted ? 'var(--oww-gold)' : 'var(--oww-brown-light)' }}>
                  {dot.name}
                </span>
              )}
            </div>

            {/* Connector */}
            {i < dots.length - 1 && (
              <div className="w-3 sm:w-6 lg:w-8 h-px transition-colors duration-500"
                   style={{ 
                     backgroundColor: completedLevels.includes(i) ? 'var(--oww-gold)' : 'var(--oww-brown-light)',
                     opacity: completedLevels.includes(i) ? 1 : 0.3,
                   }} />
            )}
          </div>
        ))}
      </div>

      {/* Right label */}
      <span className="hidden sm:inline font-mono text-[9px] font-bold tracking-[0.12em] uppercase ml-2"
            style={{ color: 'var(--oww-brown-light)' }}>
        GOBLA
      </span>
    </div>
  );
}
