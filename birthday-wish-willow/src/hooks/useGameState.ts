// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Game State Hook
// Manages puzzle progression & persistence
// ══════════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'oww-game-state';

export interface GameState {
  currentLevel: number;   // 0-5
  completedLevels: number[];
  wishText: string;       // From Stage 4 cipher machine
  wishCipherMode: string;
  startedAt: string;
}

const DEFAULT_STATE: GameState = {
  currentLevel: 0,
  completedLevels: [],
  wishText: '',
  wishCipherMode: 'caesar',
  startedAt: new Date().toISOString(),
};

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}

function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

  const completeLevel = useCallback((level: number) => {
    setState((prev) => ({
      ...prev,
      completedLevels: [...new Set([...prev.completedLevels, level])],
      currentLevel: Math.max(prev.currentLevel, level + 1),
    }));
  }, []);

  const setWish = useCallback((text: string, cipherMode: string) => {
    setState((prev) => ({ ...prev, wishText: text, wishCipherMode: cipherMode }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...DEFAULT_STATE, startedAt: new Date().toISOString() });
  }, []);

  const isLevelUnlocked = useCallback((level: number) => {
    return level === 0 || state.completedLevels.includes(level - 1);
  }, [state.completedLevels]);

  return { state, completeLevel, setWish, resetGame, isLevelUnlocked };
}
